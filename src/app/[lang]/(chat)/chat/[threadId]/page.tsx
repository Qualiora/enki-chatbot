import type { UIMessage } from "ai"

import { Thread } from "@/components/thread"

export default async function ChatPage(props: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await props.params
  const initialMessages: UIMessage[] = [
    {
      id: crypto.randomUUID(),
      role: "user",
      content: "Hey, I had a really productive day!",
      parts: [{ type: "text", text: "Hey, I had a really productive day!" }],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "That's awesome! What did you get done?",
      parts: [{ type: "text", text: "That's awesome! What did you get done?" }],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content:
        "I finished my presentation, went for a jog, and even cooked dinner.",
      parts: [
        {
          type: "text",
          text: "I finished my presentation, went for a jog, and even cooked dinner.",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Wow, sounds like you were on a roll! What was the presentation about?",
      parts: [
        {
          type: "text",
          text: "Wow, sounds like you were on a roll! What was the presentation about?",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content:
        "It was on AI and its applications in healthcare. Got great feedback!",
      parts: [
        {
          type: "text",
          text: "It was on AI and its applications in healthcare. Got great feedback!",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "That sounds fascinating! Could you give me an example of an AI application in healthcare?",
      parts: [
        {
          type: "text",
          text: "That sounds fascinating! Could you give me an example of an AI application in healthcare?",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content:
        "Absolutely! For example, machine learning algorithms are being used to analyze medical images like X-rays and MRIs for early disease detection. Here's a simplified Python example of how you might load and process an image for analysis (though a real scenario would be far more complex):",
      parts: [
        {
          type: "text",
          text: "Absolutely! For example, machine learning algorithms are being used to analyze medical images like X-rays and MRIs for early disease detection. Here's a simplified Python example of how you might load and process an image for analysis (though a real scenario would be far more complex):",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `That's a fantastic application! Early disease detection is crucial. To give you a better idea, here's a Python snippet illustrating how you might start by loading and resizing an image, which is a common first step in many image processing tasks for AI. Remember, in a full-fledged medical AI system, there would be many more steps involved, including advanced image preprocessing, model training, and evaluation.

\`\`\`python
from PIL import Image
import numpy as np

def load_and_resize_image(image_path, size=(128, 128)):
    """
    Loads an image and resizes it.
    In a real ML application, further preprocessing like normalization
    would be applied.
    """
    try:
        img = Image.open(image_path).convert('L') # Convert to grayscale
        img = img.resize(size)
        img_array = np.array(img)
        return img_array
    except FileNotFoundError:
        return "Error: Image file not found."
    except Exception as e:
        return f"An error occurred: {e}"

# Example usage (assuming 'medical_scan.png' exists)
# dummy_image_path = "medical_scan.png" 
# For demonstration, let's just create a dummy array
dummy_image_array = np.random.randint(0, 256, size=(256, 256), dtype=np.uint8)
print("Simulated image array shape:", dummy_image_array.shape)
print("Simulated image data snippet:\\n", dummy_image_array[:5, :5])
\`\`\``,
      parts: [
        {
          type: "text",
          text: `That's a fantastic application! Early disease detection is crucial. To give you a better idea, here's a Python snippet illustrating how you might start by loading and resizing an image, which is a common first step in many image processing tasks for AI. Remember, in a full-fledged medical AI system, there would be many more steps involved, including advanced image preprocessing, model training, and evaluation.

\`\`\`python
from PIL import Image
import numpy as np

def load_and_resize_image(image_path, size=(128, 128)):
    """
    Loads an image and resizes it.
    In a real ML application, further preprocessing like normalization
    would be applied.
    """
    try:
        img = Image.open(image_path).convert('L') # Convert to grayscale
        img = img.resize(size)
        img_array = np.array(img)
        return img_array
    except FileNotFoundError:
        return "Error: Image file not found."
    except Exception as e:
        return f"An error occurred: {e}"

# Example usage (assuming 'medical_scan.png' exists)
# dummy_image_path = "medical_scan.png" 
# For demonstration, let's just create a dummy array
dummy_image_array = np.random.randint(0, 256, size=(256, 256), dtype=np.uint8)
print("Simulated image array shape:", dummy_image_array.shape)
print("Simulated image data snippet:\\n", dummy_image_array[:5, :5])
\`\`\``,
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "user",
      content:
        "That's a neat example! It really helps visualize how you'd start working with image data. We also discussed how AI can assist in drug discovery by predicting molecular interactions.",
      parts: [
        {
          type: "text",
          text: "That's a neat example! It really helps visualize how you'd start working with image data. We also discussed how AI can assist in drug discovery by predicting molecular interactions.",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "That's incredible! So AI could potentially speed up the development of new medications significantly. It sounds like you had a really insightful presentation.",
      parts: [
        {
          type: "text",
          text: "That's incredible! So AI could potentially speed up the development of new medications significantly. It sounds like you had a really insightful presentation.",
        },
      ],
    },
  ]

  return <Thread threadId={threadId} initialMessages={initialMessages} />
}
