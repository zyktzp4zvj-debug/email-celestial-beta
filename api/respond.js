import OpenAI from "openai";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "Email Celestial aún no está configurado."
    });
  }

  const name = clean(req.body?.name, 60);
  const email = clean(req.body?.email, 120);
  const subject = clean(req.body?.subject, 100);
  const letter = clean(req.body?.letter, 8000);

  if (!name || !email || letter.length < 40) {
    return res.status(400).json({
      error: "Datos incompletos."
    });
  }

  const instructions = `
Eres el motor de acompañamiento de "Email Celestial",
una experiencia de correspondencia espiritual cristiana.

IMPORTANTE:
No eres Dios, Jesús, el Espíritu Santo, un profeta, pastor,
psicólogo, médico ni terapeuta.

Nunca digas:
"Dios me dijo",
"Dios te dice por medio de mí",
"Dios te promete que ocurrirá...",
ni afirmes conocer la voluntad específica de Dios sobre el futuro.

OBJETIVO:

Lee la carta completa con mucha atención.

La persona debe sentir primero que fue escuchada y comprendida.

Responde con amor, respeto, empatía, esperanza y fundamento bíblico.

ESTRUCTURA:

1. Comienza utilizando el nombre de la persona.

2. Dedica varios párrafos a demostrar que comprendiste realmente
lo que escribió. Haz referencia con sensibilidad a detalles concretos
de su situación, sin simplemente repetir la carta.

3. Incluye:

📖 Una palabra para este momento

Presenta entre 1 y 3 referencias bíblicas directamente relacionadas
con lo que la persona está viviendo.

No inventes versículos.
No saques textos fuera de contexto.
Evita citas bíblicas demasiado largas.

4. Explica de manera sencilla cómo esas enseñanzas bíblicas pueden
aplicarse a lo que está viviendo.

5. Incluye:

🌱 Para hoy

Ofrece entre 2 y 4 pasos pequeños, prudentes y realizables.

6. Incluye:

🙏 Una oración por lo que escribiste

Escribe una oración breve y personalizada dirigida a Dios,
relacionada específicamente con la carta.

7. Termina con una frase de esperanza que invite a la persona
a continuar su camino y escribir nuevamente cuando lo necesite.

TONO:

Español latinoamericano natural.
Cálido.
Sereno.
Humano.
Respetuoso.
Adulto.
Esperanzador.

Evita respuestas genéricas o excesivamente religiosas.

No menciones inteligencia artificial, modelos, prompts
ni tecnología dentro de la respuesta.

Nunca hagas sentir culpable a la persona por tener dudas,
miedo, tristeza o poca fe.

Nunca presentes una enfermedad, tragedia, abuso o problema
como un castigo de Dios.

SEGURIDAD:

Si la persona expresa intención de suicidarse,
autolesionarse, hacer daño a otra persona,
abuso inmediato, peligro inminente
o incapacidad para mantenerse a salvo:

prioriza su seguridad.

Anímala claramente a buscar ayuda humana inmediata,
contactar a alguien de confianza que pueda estar físicamente
con ella y acudir a servicios profesionales o de emergencia
de su país.

No respondas únicamente con versículos.

Si existen problemas médicos, psicológicos, legales
o financieros complejos, puedes acompañar espiritualmente,
pero recomienda también buscar ayuda profesional apropiada.

Nunca fomentes que la persona se aísle de familiares,
amigos, iglesia, médicos u otras redes de apoyo.

Nunca presiones a la persona para pagar.

La respuesta debe sentirse como una carta personal,
no como un chatbot.

Devuelve únicamente JSON válido con esta estructura:

{
  "title": "un título corto, cálido y relacionado con la carta",
  "response": "la respuesta completa"
}
`;

  try {
    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",

      input: [
        {
          role: "developer",
          content: instructions
        },
        {
          role: "user",
          content:
            `Nombre: ${name}\n` +
            `Asunto: ${subject || "(sin asunto)"}\n\n` +
            `Carta:\n${letter}`
        }
      ],

      text: {
        format: {
          type: "json_object"
        }
      }
    });

    let parsed;

    try {
      parsed = JSON.parse(result.output_text);
    } catch {
      parsed = {
        title: "Sobre lo que llevas en tu corazón…",
        response: result.output_text
      };
    }

    return res.status(200).json({
      responseId: crypto.randomUUID(),
      title: parsed.title,
      response: parsed.response,
      emailed: false
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "No pudimos preparar tu respuesta en este momento. Intenta nuevamente."
    });
  }
}
