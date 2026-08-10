# Email Celestial — Beta 0.1

Primera versión privada para validar la experiencia con aproximadamente 20 adultos.

## Qué incluye
- Landing page de Email Celestial.
- Formulario de carta.
- Respuesta generada con OpenAI, con reglas bíblicas, emocionales y de seguridad.
- Respuesta visible dentro de la web.
- Envío opcional de la respuesta al email del participante usando Resend.
- Revisión humana opcional: solo se envía una copia de la carta al administrador si el participante marca el consentimiento.
- Encuesta de validación de 4 preguntas.
- Feedback enviado al administrador por email.
- Sin base de datos en esta beta.

## Antes de publicar

### 1. Crea una API key de OpenAI
Añade en Vercel:
`OPENAI_API_KEY`

Opcionalmente:
`OPENAI_MODEL=gpt-5.4-mini`

### 2. Resend (opcional pero recomendado)
Para que la persona también reciba su respuesta por correo:
- Crea una cuenta de Resend.
- Verifica un dominio.
- Crea una API key.
- Configura:
  - `RESEND_API_KEY`
  - `FROM_EMAIL`
  - `ADMIN_EMAIL`

Si no configuras Resend, la aplicación sigue funcionando y muestra la respuesta en pantalla, pero no envía correos ni feedback al administrador.

### 3. Publicar en Vercel
Instala Node.js y luego:

```bash
npm install
npm i -g vercel
vercel --prod
```

Vercel te pedirá iniciar sesión y creará la URL pública.

También puedes subir el proyecto a GitHub y conectarlo desde el dashboard de Vercel.

### 4. Variables de entorno
En Vercel:
Project → Settings → Environment Variables

Añade las variables del archivo `.env.example` y vuelve a desplegar.

## Prueba recomendada antes de compartir
Haz al menos estas pruebas:
1. Carta de gratitud.
2. Carta sobre preocupación económica.
3. Carta sobre relación/soledad.
4. Carta con culpa/arrepentimiento.
5. Carta que mencione peligro o crisis para comprobar que la respuesta prioriza ayuda humana.
6. Carta muy breve: debe ser rechazada.
7. Email inválido: debe ser rechazado.
8. Revisión humana desmarcada: no debe llegar copia de carta al administrador.
9. Revisión humana marcada: debe llegar copia si Resend está configurado.
10. Encuesta completa: debe llegar al administrador.

## Métricas de la beta
Para 20 participantes, observar:
- Promedio "Me comprendió" (meta sugerida: ≥4.2/5)
- Promedio "Me dio esperanza/claridad" (meta sugerida: ≥4.2/5)
- % que responde "Sí" a volver a usarlo (meta sugerida: ≥60%)
- % "Sí" o "Tal vez" a US$6.99/mes
- Comentarios espontáneos: especialmente frases como "sentí que me entendió", "volvería a escribir", "se lo recomendaría a alguien".

## Privacidad de esta beta
Esta versión no crea perfiles ni historial permanente. La carta se envía a OpenAI para producir la respuesta. Si el participante autoriza revisión humana y Resend está configurado, una copia de su carta y respuesta llega al email del administrador.

Antes de un lanzamiento público real deben prepararse política de privacidad, términos, eliminación de datos, controles de acceso, almacenamiento seguro y revisión legal.

## Importante
Email Celestial no se presenta como Dios ni como una revelación divina. Las respuestas ofrecen acompañamiento basado en principios bíblicos y deben derivar a ayuda humana/profesional cuando exista riesgo o una situación que exceda el acompañamiento espiritual.
