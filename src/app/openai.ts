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

  console.log("uploadToOpenAI");

  try {
    const res: Response = await axios.post<OpenAIResponse>(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: `You are a software architect with expertise in drawing diagrams.
                      Please list the objects, the text in each and the relationships between
                      the objects, and formulate the output as draw.io compatible inline xml.
                      ONLY answer with xml, no text before or after`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: image,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 2048,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log("RESPONSE!");
    let msg = res.data.choices[0].message.content;
    const lines = msg.split("\n");
    if (lines.length > 1 && lines[0].includes("```")) {
      msg = msg.split("\n").slice(1, -1).join("\n");
    }
    graph = msg;
  } catch (error) {
    console.log("ERROR!");
    console.log(error);
    throw new Error();
  }

  return graph;
};
