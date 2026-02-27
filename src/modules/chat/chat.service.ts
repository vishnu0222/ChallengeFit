import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import type * as ResponsesAPI from "openai/resources/responses/responses";
import { WorkoutPlanService } from "../workout/services/workout-plans.service";
import { ChallengeService } from "../challenge/challenge.service";
import { ChatDto } from "./dto/chat.dto";
import { WorkoutSplitsService } from "../workout/services/workout-splits.service";
import { UserService } from "../user/user.service";

@Injectable()
export class ChatService {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(
    private readonly workoutPlans: WorkoutPlanService,
    private readonly workoutSplits: WorkoutSplitsService,
    private readonly challenges: ChallengeService,
    private readonly users: UserService,
  ) {}

  // Define tools for the OpenAI model to use
  private tools: ResponsesAPI.Tool[] = [
    {
      type: "function",
      name: "get_user_profile",
      description: "Get the authenticated user's basic profile (name and email)",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_user_workout_plans",
      description: "List workout plans for a user",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_workout_plan_by_id",
      description: "Get a workout plan by its ID",
      parameters: {
        type: "object",
        properties: {
          workoutPlanId: { type: "number" },
        },
        required: ["workoutPlanId"],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_workout_splits_for_plan",
      description: "List workout splits for a workout plan",
      parameters: {
        type: "object",
        properties: {
          workoutPlanId: { type: "number" },
        },
        required: ["workoutPlanId"],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_workout_split_by_id",
      description: "Get a workout split by plan ID and split ID",
      parameters: {
        type: "object",
        properties: {
          workoutPlanId: { type: "number" },
          workoutSplitId: { type: "number" },
        },
        required: ["workoutPlanId", "workoutSplitId"],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_user_challenge_participations",
      description: "List challenges the user has joined",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_user_created_challenges",
      description: "List challenges the user has created",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      name: "get_challenge_by_id",
      description: "Get a challenge by its ID",
      parameters: {
        type: "object",
        properties: {
          challengeId: { type: "number" },
        },
        required: ["challengeId"],
        additionalProperties: false,
      },
      strict: true,
    },
  
    {
      type: "function",
      name: "get_active_challenges",
      description: "List currently active challenges",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
      strict: true,
    },
  ];

  async chat(userId: number, dto: ChatDto) {
    if (!userId) return { message: "User not authenticated." };

    const input: ResponsesAPI.ResponseInputItem[] = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are a fitness assistant. Use tools to fetch the user's workouts or challenges before answering. " +
              "The server already knows the authenticated user's ID; do not ask for it. " +
              "Always respond in JSON with shape: {\"message\": string, \"items\": any[] | null}. " +
              "If a list is appropriate, put items in \"items\" and keep \"message\" concise.",
          },
        ],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: dto.message }],
      },
    ];

    let response = await this.client.responses.create({
      model: process.env.OPENAI_MODEL || "o4-mini",
      input,
      tools: this.tools,
      max_output_tokens: 5000,
    });

    let safetyCounter = 0;
    while (response.output?.some((o) => o.type === "function_call") && safetyCounter < 5) {
      safetyCounter++;

      const toolCalls = response.output.filter((o) => o.type === "function_call");
      const toolOutputs: ResponsesAPI.ResponseInputItem[] = [];

      for (const call of toolCalls) {
        const args = JSON.parse(call.arguments || "{}");
        let result: any = null;

        switch (call.name) {
          case "get_user_profile":
            result = await this.users.getProfile(userId);
            break;

          case "get_user_workout_plans":
            result = await this.workoutPlans.getAllWorkoutPlans(userId);
            break;

          case "get_workout_plan_by_id":
            result = await this.workoutPlans.getWorkoutPlanById(args.workoutPlanId);
            break;

          case "get_workout_splits_for_plan":
            result = await this.workoutSplits.getAllWorkoutSplits(args.workoutPlanId);
            break;

          case "get_workout_split_by_id":
            result = await this.workoutSplits.getWorkoutSplitById(
              args.workoutPlanId,
              args.workoutSplitId,
            );
            break;

          case "get_user_challenge_participations":
            result = await this.challenges.getParticipations(userId);
            break;

          case "get_user_created_challenges":
            result = await this.users.getCreatedChallenges(userId);
            break;

          case "get_challenge_by_id":
            result = await this.challenges.getChallengeById(args.challengeId);
            break;

          case "get_active_challenges":
            result = await this.challenges.getActiveChallenges();
            break;

          default:
            result = { error: "Unknown tool" };
        }

        toolOutputs.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify(result),
        });
      }

      response = await this.client.responses.create({
        model: process.env.OPENAI_MODEL || "o4-mini",
        input: [...input, ...response.output, ...toolOutputs],
        tools: this.tools,
        max_output_tokens: 5000,
      });
    }

    const outputText = response.output_text ?? "";
    if (outputText) {
      try {
        const parsed = JSON.parse(outputText);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch {}
    }
    return { message: outputText || "No response.", items: null };
  }
}
