import axios, { AxiosResponse } from "axios";

type OpenAIMessage = {
  content: string;
};

type OpenAIChoice = {
  message: OpenAIMessage;
};

type OpenAIResponse = {
  choices: OpenAIChoice[];
};

type Response = {
  data: OpenAIResponse;
};

export const uploadToOpenAI = async (image: string, apiKey: string) => {
  let graph = "";

  try {
    const res: Response = await axios.post<OpenAIResponse>(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a software architect with expertise in drawing diagrams.
                      Please list the objects, the text in each and the relationships 
                      between the objects. If the lines between objects have text, include
                      those too.

                      If you see non-bubbled text, include them into the xml too.

                      Aim for a clean layout.

                      Formulate the output as a single draw.io compatible inline xml structure.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    let msg = res.data.choices[0].message.content;

    const lines = msg.split("\n");
    const startCodeBlockIndex = lines.findIndex((line) => line.includes("```"));
    const endCodeBlockIndex = lines.findIndex(
      (line, index) => line.includes("```") && index > startCodeBlockIndex
    );
    if (startCodeBlockIndex !== -1 && endCodeBlockIndex !== -1) {
      msg = lines.slice(startCodeBlockIndex + 1, endCodeBlockIndex).join("\n");
    }
    graph = msg;

    console.log(graph);
  } catch (error) {
    console.log(error);
    throw new Error();
  }

  return graph;
};
