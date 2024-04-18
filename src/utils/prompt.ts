import prompts from "prompts";

export async function prompt(message: string): Promise<string> {
  const response = await prompts({
    type: "text",
    name: "userInput",
    message,
  });

  return response.userInput;
}
