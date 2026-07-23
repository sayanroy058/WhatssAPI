import { useState } from 'react';
import { Copy, Check, ChevronDown, Search, ExternalLink, Code, Terminal, BookOpen } from 'lucide-react';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  payload?: string;
  curl: string;
  python: string;
  note?: string;
}

interface Category {
  name: string;
  icon: string;
  description: string;
  endpoints: Endpoint[];
}

const apiData: Category[] = [
  {
    name: 'Sessions',
    icon: '📱',
    description: 'Manage WhatsApp instances — create, start, stop, logout, and monitor sessions.',
    endpoints: [
      {
        method: 'GET', path: '/api/sessions',
        description: 'List all sessions (use ?all=true to include stopped)',
        curl: `curl -X GET "http://localhost:3000/api/sessions?all=true" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/sessions", params={"all": True}, headers={"X-Api-Key": "YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/sessions/{session}',
        description: 'Get details for a specific session',
        curl: `curl -X GET "http://localhost:3000/api/sessions/default" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/sessions/default", headers={"X-Api-Key": "YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions',
        description: 'Create a new WhatsApp session',
        payload: `{"name": "default", "config": {"proxy": null, "webhooks": []}}`,
        curl: `curl -X POST "http://localhost:3000/api/sessions" \\\n  -H "X-Api-Key: YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"default"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions", json={"name":"default"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/sessions/{name}',
        description: 'Update session config (engine, webhooks, proxy)',
        payload: `{"config": {"webhooks": [{"url": "https://example.com/hook", "events": ["message"]}]}}`,
        curl: `curl -X PUT "http://localhost:3000/api/sessions/default" \\\n  -H "X-Api-Key: YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"config":{"webhooks":[{"url":"https://example.com/hook","events":["message"]}]}}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/sessions/default", json={"config":{"webhooks":[{"url":"https://example.com/hook","events":["message"]}]}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'DELETE', path: '/api/sessions/{name}',
        description: 'Delete a session permanently',
        curl: `curl -X DELETE "http://localhost:3000/api/sessions/default" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.delete("http://localhost:3000/api/sessions/default", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.status_code)`,
      },
      {
        method: 'POST', path: '/api/sessions/{name}/start',
        description: 'Start a stopped session',
        curl: `curl -X POST "http://localhost:3000/api/sessions/default/start" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/default/start", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions/{name}/stop',
        description: 'Stop a running session',
        curl: `curl -X POST "http://localhost:3000/api/sessions/default/stop" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/default/stop", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions/{name}/restart',
        description: 'Restart a session',
        curl: `curl -X POST "http://localhost:3000/api/sessions/default/restart" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/default/restart", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions/{name}/logout',
        description: 'Logout from WhatsApp (requires re-scanning QR)',
        curl: `curl -X POST "http://localhost:3000/api/sessions/default/logout" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/default/logout", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/sessions/{name}/me',
        description: 'Get authenticated user info (phone number, name, profile pic)',
        curl: `curl -X GET "http://localhost:3000/api/sessions/default/me" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/sessions/default/me", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/sessions/{name}/screenshot',
        description: 'Get real-time screenshot of WhatsApp Web (PNG)',
        curl: `curl -X GET "http://localhost:3000/api/sessions/default/screenshot" \\\n  -H "X-Api-Key: YOUR_API_KEY" --output screenshot.png`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/sessions/default/screenshot", headers={"X-Api-Key":"YOUR_API_KEY"})\nwith open("screenshot.png","wb") as f: f.write(r.content)\nprint("Saved!")`,
        note: 'Returns PNG image. Useful for debugging or viewing QR codes.',
      },
      {
        method: 'GET', path: '/api/{session}/auth/qr',
        description: 'Get QR code image for WhatsApp Web login',
        curl: `curl -X GET "http://localhost:3000/api/default/auth/qr" \\\n  -H "X-Api-Key: YOUR_API_KEY" --output qr.png`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/auth/qr", headers={"X-Api-Key":"YOUR_API_KEY"})\nwith open("qr.png","wb") as f: f.write(r.content)\nprint("Scan with WhatsApp → Linked Devices")`,
        note: 'Scan with WhatsApp mobile app → Settings → Linked Devices.',
      },
      {
        method: 'POST', path: '/api/{session}/auth/request-code',
        description: 'Request phone pairing code (alternative to QR)',
        payload: `{"phoneNumber": "919876543210"}`,
        curl: `curl -X POST "http://localhost:3000/api/default/auth/request-code" \\\n  -H "X-Api-Key: YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"phoneNumber":"919876543210"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/auth/request-code", json={"phoneNumber":"919876543210"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: 'Sends a pairing code to WhatsApp. Enter the code in WhatsApp → Linked Devices.',
      },
      {
        method: 'POST', path: '/api/{session}/auth/passkey',
        description: 'Register a passkey for authentication',
        curl: `curl -X POST "http://localhost:3000/api/default/auth/passkey" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/auth/passkey", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions/logout',
        description: 'Logout ALL sessions (session-less variant)',
        curl: `curl -X POST "http://localhost:3000/api/sessions/logout" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/logout", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions/start',
        description: 'Start ALL sessions (session-less variant)',
        curl: `curl -X POST "http://localhost:3000/api/sessions/start" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/start", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sessions/stop',
        description: 'Stop ALL sessions (session-less variant)',
        curl: `curl -X POST "http://localhost:3000/api/sessions/stop" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sessions/stop", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
    ],
  },
  {
    name: 'Messages',
    icon: '💬',
    description: 'Send text, media, polls, buttons, interactive lists. Reply, forward, react, star messages.',
    endpoints: [
      {
        method: 'POST', path: '/api/sendText',
        description: 'Send a text message with optional mentions & link preview',
        payload: `{"session":"default","chatId":"919876543210@c.us","text":"Hello! 👋","mentions":["919876543210@c.us"]}`,
        curl: `curl -X POST "http://localhost:3000/api/sendText" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","text":"Hello from WAHA!"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendText", json={"session":"default","chatId":"919876543210@c.us","text":"Hello!"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: 'chatId: [number]@c.us (individual) or [id]@g.us (group). Country code without +.',
      },
      {
        method: 'POST', path: '/api/reply',
        description: 'Reply to a specific message (quoted reply)',
        payload: `{"session":"default","chatId":"919876543210@c.us","text":"Got it!","reply_to":"false_919876543210@c.us_MSGID"}`,
        curl: `curl -X POST "http://localhost:3000/api/reply" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","text":"Got it!","reply_to":"MSGID"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/reply", json={"session":"default","chatId":"919876543210@c.us","text":"Got it!","reply_to":"MSGID"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/forwardMessage',
        description: 'Forward a message to another chat',
        payload: `{"session":"default","messageId":"MSGID","chatId":"911234567890@c.us"}`,
        curl: `curl -X POST "http://localhost:3000/api/forwardMessage" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","messageId":"MSGID","chatId":"911234567890@c.us"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/forwardMessage", json={"session":"default","messageId":"MSGID","chatId":"911234567890@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendImage',
        description: 'Send an image (via URL or base64)',
        payload: `{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/photo.jpg"},"caption":"Check this!"}`,
        curl: `curl -X POST "http://localhost:3000/api/sendImage" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/photo.jpg"},"caption":"Nice!"}'`,
        python: `import requests, base64\n# Via URL\nr = requests.post("http://localhost:3000/api/sendImage", json={"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/img.jpg"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\n# Via base64\nwith open("local.jpg","rb") as f: b64 = base64.b64encode(f.read()).decode()\nr = requests.post("http://localhost:3000/api/sendImage", json={"session":"default","chatId":"919876543210@c.us","file":{"data":b64,"mimetype":"image/jpeg"}}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/sendVoice',
        description: 'Send a voice note (audio file)',
        payload: `{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/audio.ogg"}}`,
        curl: `curl -X POST "http://localhost:3000/api/sendVoice" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/audio.ogg"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendVoice", json={"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/audio.ogg"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendVideo',
        description: 'Send a video file with optional caption',
        payload: `{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/video.mp4"},"caption":"Watch!"}`,
        curl: `curl -X POST "http://localhost:3000/api/sendVideo" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/video.mp4"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendVideo", json={"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/video.mp4"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendFile',
        description: 'Send any file as a document',
        payload: `{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/report.pdf"}}`,
        curl: `curl -X POST "http://localhost:3000/api/sendFile" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/report.pdf"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendFile", json={"session":"default","chatId":"919876543210@c.us","file":{"url":"https://example.com/report.pdf"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendLocation',
        description: 'Send a location pin (lat/lng)',
        payload: `{"session":"default","chatId":"919876543210@c.us","location":{"latitude":12.9716,"longitude":77.5946,"name":"Bangalore"}}`,
        curl: `curl -X POST "http://localhost:3000/api/sendLocation" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","location":{"latitude":12.9716,"longitude":77.5946}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendLocation", json={"session":"default","chatId":"919876543210@c.us","location":{"latitude":12.9716,"longitude":77.5946}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendContactVcard',
        description: 'Send a contact card (vCard)',
        payload: `{"session":"default","chatId":"919876543210@c.us","contact":{"fullName":"John Doe","phoneNumber":"+1234567890"}}`,
        curl: `curl -X POST "http://localhost:3000/api/sendContactVcard" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","contact":{"fullName":"John","phoneNumber":"+1234567890"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendContactVcard", json={"session":"default","chatId":"919876543210@c.us","contact":{"fullName":"John Doe","phoneNumber":"+1234567890"}}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/sendPoll',
        description: 'Send an interactive poll',
        payload: `{"session":"default","chatId":"919876543210@c.us","poll":{"name":"Best color?","options":["Red","Blue","Green"],"multipleAnswers":false}}`,
        curl: `curl -X POST "http://localhost:3000/api/sendPoll" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","poll":{"name":"Best color?","options":["Red","Blue"],"multipleAnswers":false}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendPoll", json={"session":"default","chatId":"919876543210@c.us","poll":{"name":"Best?","options":["A","B"],"multipleAnswers":False}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendPollVote',
        description: 'Vote on a poll message',
        payload: `{"session":"default","pollMessageId":"MSGID","options":["Red"]}`,
        curl: `curl -X POST "http://localhost:3000/api/sendPollVote" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","pollMessageId":"MSGID","options":["Red"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendPollVote", json={"session":"default","pollMessageId":"MSGID","options":["Red"]}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/sendButtons',
        description: 'Send interactive button messages',
        payload: `{"session":"default","chatId":"919876543210@c.us","title":"Confirm?","buttons":[{"id":"yes","text":"✅ Yes"},{"id":"no","text":"❌ No"}],"footer":"Choose wisely"}`,
        curl: `curl -X POST "http://localhost:3000/api/sendButtons" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","title":"Confirm?","buttons":[{"id":"yes","text":"Yes"},{"id":"no","text":"No"}]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendButtons", json={"session":"default","chatId":"919876543210@c.us","title":"Confirm?","buttons":[{"id":"yes","text":"Yes"},{"id":"no","text":"No"}]}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/send/buttons/reply',
        description: 'Send a button reply (response to interactive button)',
        payload: `{"session":"default","buttonId":"yes","buttonText":"✅ Yes","chatId":"919876543210@c.us","messageId":"MSGID"}`,
        curl: `curl -X POST "http://localhost:3000/api/send/buttons/reply" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","buttonId":"yes","buttonText":"Yes","chatId":"919876543210@c.us","messageId":"MSGID"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/send/buttons/reply", json={"session":"default","buttonId":"yes","buttonText":"Yes","chatId":"919876543210@c.us","messageId":"MSGID"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/sendList',
        description: 'Send an interactive list message',
        payload: `{"session":"default","chatId":"919876543210@c.us","title":"Menu","buttonText":"Select","sections":[{"title":"Drinks","rows":[{"id":"1","title":"Coffee"}]}]}`,
        curl: `curl -X POST "http://localhost:3000/api/sendList" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","title":"Menu","buttonText":"Select","sections":[{"title":"Drinks","rows":[{"id":"1","title":"Coffee"}]}]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendList", json={"session":"default","chatId":"919876543210@c.us","title":"Menu","buttonText":"Select","sections":[{"title":"Items","rows":[{"id":"1","title":"Item 1"}]}]}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/sendLinkPreview',
        description: 'Send a text with auto-generated link preview',
        payload: `{"session":"default","chatId":"919876543210@c.us","text":"Check this out: https://example.com","linkPreview":true}`,
        curl: `curl -X POST "http://localhost:3000/api/sendLinkPreview" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","text":"https://example.com","linkPreview":true}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendLinkPreview", json={"session":"default","chatId":"919876543210@c.us","text":"https://example.com","linkPreview":True}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/send/link-custom-preview',
        description: 'Send a link with a custom preview (title, description, image)',
        payload: `{"session":"default","chatId":"919876543210@c.us","url":"https://example.com","title":"Custom Title","description":"My description","image":"https://example.com/thumb.jpg"}`,
        curl: `curl -X POST "http://localhost:3000/api/send/link-custom-preview" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","url":"https://example.com","title":"Custom Title"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/send/link-custom-preview", json={"session":"default","chatId":"919876543210@c.us","url":"https://example.com","title":"Custom"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/sendSeen',
        description: 'Mark a chat as seen (blue double ticks)',
        payload: `{"session":"default","chatId":"919876543210@c.us","messageId":"MSGID"}`,
        curl: `curl -X POST "http://localhost:3000/api/sendSeen" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us","messageId":"MSGID"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/sendSeen", json={"session":"default","chatId":"919876543210@c.us","messageId":"MSGID"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'PUT', path: '/api/reaction',
        description: 'React to a message with emoji (or remove reaction with empty string)',
        payload: `{"session":"default","messageId":"MSGID","reaction":"👍"}`,
        curl: `curl -X PUT "http://localhost:3000/api/reaction" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","messageId":"MSGID","reaction":"👍"}'`,
        python: `import requests\n# Add reaction\nr = requests.put("http://localhost:3000/api/reaction", json={"session":"default","messageId":"MSGID","reaction":"👍"}, headers={"X-Api-Key":"YOUR_API_KEY"})\n# Remove reaction\nr = requests.put("http://localhost:3000/api/reaction", json={"session":"default","messageId":"MSGID","reaction":""}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'PUT', path: '/api/star',
        description: 'Star/unstar a message',
        payload: `{"session":"default","messageId":"MSGID","star":true}`,
        curl: `curl -X PUT "http://localhost:3000/api/star" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","messageId":"MSGID","star":true}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/star", json={"session":"default","messageId":"MSGID","star":True}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/startTyping',
        description: 'Show typing indicator in a chat',
        payload: `{"session":"default","chatId":"919876543210@c.us"}`,
        curl: `curl -X POST "http://localhost:3000/api/startTyping" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us"}'`,
        python: `import requests\nrequests.post("http://localhost:3000/api/startTyping", json={"session":"default","chatId":"919876543210@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nrequests.post("http://localhost:3000/api/stopTyping", json={"session":"default","chatId":"919876543210@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
    ],
  },
  {
    name: 'Chats',
    icon: '📋',
    description: 'List chats, get messages, pin, archive, delete chats. Full conversation management.',
    endpoints: [
      {
        method: 'GET', path: '/api/{session}/chats',
        description: 'List all chats with pagination (limit, offset)',
        curl: `curl -X GET "http://localhost:3000/api/default/chats?limit=50&offset=0" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/chats", params={"limit":50,"offset":0}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/chats/overview',
        description: 'Get chat overview with last message (perfect for chat list UIs)',
        curl: `curl -X GET "http://localhost:3000/api/default/chats/overview?limit=50" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/chats/overview", params={"limit":50}, headers={"X-Api-Key":"YOUR_API_KEY"})\nfor c in r.json(): print(c.get("name"), c.get("lastMessage"))`,
        note: 'Returns compact chat objects with lastMessage, unreadCount, timestamp. Ideal for UIs.',
      },
      {
        method: 'GET', path: '/api/{session}/chats/{chatId}/picture',
        description: 'Get chat profile picture URL',
        curl: `curl -X GET "http://localhost:3000/api/default/chats/919876543210@c.us/picture" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/chats/919876543210@c.us/picture", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/chats/{chatId}/messages',
        description: 'Get messages from a chat (paginated)',
        curl: `curl -X GET "http://localhost:3000/api/default/chats/919876543210@c.us/messages?limit=100" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/chats/919876543210@c.us/messages", params={"limit":100}, headers={"X-Api-Key":"YOUR_API_KEY"})\nfor m in r.json(): print(m.get("body","[media]"))`,
      },
      {
        method: 'GET', path: '/api/{session}/chats/{chatId}/messages/{messageId}',
        description: 'Get a single message by ID',
        curl: `curl -X GET "http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/chats/{chatId}/messages/{messageId}',
        description: 'Edit a previously sent message (text/caption only)',
        payload: `{"text": "Updated message content"}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"text":"Updated content"}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID", json={"text":"Updated"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: 'This is the EDIT MESSAGE endpoint. Only works for text messages and captions.',
      },
      {
        method: 'DELETE', path: '/api/{session}/chats/{chatId}/messages/{messageId}',
        description: 'Delete a specific message',
        curl: `curl -X DELETE "http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.delete("http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.status_code)`,
      },
      {
        method: 'DELETE', path: '/api/{session}/chats/{chatId}/messages',
        description: 'Clear ALL messages in a chat',
        curl: `curl -X DELETE "http://localhost:3000/api/default/chats/919876543210@c.us/messages" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.delete("http://localhost:3000/api/default/chats/919876543210@c.us/messages", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.status_code)`,
      },
      {
        method: 'POST', path: '/api/{session}/chats/{chatId}/messages/{messageId}/pin',
        description: 'Pin a message in the chat',
        curl: `curl -X POST "http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID/pin" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID/pin", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/chats/{chatId}/messages/{messageId}/unpin',
        description: 'Unpin a previously pinned message',
        curl: `curl -X POST "http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID/unpin" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/chats/919876543210@c.us/messages/MSGID/unpin", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/chats/{chatId}/messages/read',
        description: 'Mark all messages in a chat as read',
        curl: `curl -X POST "http://localhost:3000/api/default/chats/919876543210@c.us/messages/read" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/chats/919876543210@c.us/messages/read", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/chats/{chatId}/archive',
        description: 'Archive a chat',
        curl: `curl -X POST "http://localhost:3000/api/default/chats/919876543210@c.us/archive" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nrequests.post("http://localhost:3000/api/default/chats/919876543210@c.us/archive", headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/chats/{chatId}/unarchive',
        description: 'Unarchive a chat',
        curl: `curl -X POST "http://localhost:3000/api/default/chats/919876543210@c.us/unarchive" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nrequests.post("http://localhost:3000/api/default/chats/919876543210@c.us/unarchive", headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/chats/{chatId}/unread',
        description: 'Mark a chat as unread',
        curl: `curl -X POST "http://localhost:3000/api/default/chats/919876543210@c.us/unread" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nrequests.post("http://localhost:3000/api/default/chats/919876543210@c.us/unread", headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'DELETE', path: '/api/{session}/chats/{chatId}',
        description: 'Delete an entire chat conversation',
        curl: `curl -X DELETE "http://localhost:3000/api/default/chats/919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.delete("http://localhost:3000/api/default/chats/919876543210@c.us", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.status_code)`,
      },
    ],
  },
  {
    name: 'Groups',
    icon: '👥',
    description: 'Create groups, manage participants, promote/demote admins, invite links, security settings.',
    endpoints: [
      {
        method: 'GET', path: '/api/{session}/groups',
        description: 'List all groups the session is part of',
        curl: `curl -X GET "http://localhost:3000/api/default/groups" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/count',
        description: 'Get total count of groups',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/count" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/count", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/groups',
        description: 'Create a new group with participants',
        payload: `{"name":"My Group","participants":["919876543210@c.us","911234567890@c.us"]}`,
        curl: `curl -X POST "http://localhost:3000/api/default/groups" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"name":"My Group","participants":["919876543210@c.us"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups", json={"name":"My Group","participants":["919876543210@c.us"]}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/{groupId}',
        description: 'Get group details by ID',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/123456789@g.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/123456789@g.us", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/{groupId}/participants',
        description: 'List all participants in a group',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/123456789@g.us/participants" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/123456789@g.us/participants", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/{groupId}/participants/v2',
        description: 'List participants (v2 format with richer data)',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/123456789@g.us/participants/v2" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/123456789@g.us/participants/v2", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/{groupId}/participants/add',
        description: 'Add participants to a group',
        payload: `{"participants":["919876543210@c.us"]}`,
        curl: `curl -X POST "http://localhost:3000/api/default/groups/123456789@g.us/participants/add" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"participants":["919876543210@c.us"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/123456789@g.us/participants/add", json={"participants":["919876543210@c.us"]}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/{groupId}/participants/remove',
        description: 'Remove participants from a group',
        payload: `{"participants":["919876543210@c.us"]}`,
        curl: `curl -X POST "http://localhost:3000/api/default/groups/123456789@g.us/participants/remove" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"participants":["919876543210@c.us"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/123456789@g.us/participants/remove", json={"participants":["919876543210@c.us"]}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/{groupId}/admin/promote',
        description: 'Promote a participant to group admin',
        payload: `{"participants":["919876543210@c.us"]}`,
        curl: `curl -X POST "http://localhost:3000/api/default/groups/123456789@g.us/admin/promote" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"participants":["919876543210@c.us"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/123456789@g.us/admin/promote", json={"participants":["919876543210@c.us"]}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/{groupId}/admin/demote',
        description: 'Demote an admin to regular participant',
        payload: `{"participants":["919876543210@c.us"]}`,
        curl: `curl -X POST "http://localhost:3000/api/default/groups/123456789@g.us/admin/demote" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"participants":["919876543210@c.us"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/123456789@g.us/admin/demote", json={"participants":["919876543210@c.us"]}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/{groupId}/leave',
        description: 'Leave a group',
        curl: `curl -X POST "http://localhost:3000/api/default/groups/123456789@g.us/leave" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/123456789@g.us/leave", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/join',
        description: 'Join a group via invite code/link',
        payload: `{"inviteCode":"ABC123xyz"}`,
        curl: `curl -X POST "http://localhost:3000/api/default/groups/join" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"inviteCode":"ABC123"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/join", json={"inviteCode":"ABC123"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/join-info',
        description: 'Get info about a group invite link before joining',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/join-info?inviteCode=ABC123" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/join-info", params={"inviteCode":"ABC123"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/groups/{groupId}/subject',
        description: 'Change group name/subject',
        payload: `{"subject":"New Group Name"}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/groups/123456789@g.us/subject" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"subject":"New Name"}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/groups/123456789@g.us/subject", json={"subject":"New Name"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'PUT', path: '/api/{session}/groups/{groupId}/description',
        description: 'Change group description',
        payload: `{"description":"New description text"}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/groups/123456789@g.us/description" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"description":"New desc"}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/groups/123456789@g.us/description", json={"description":"New"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/{groupId}/picture',
        description: 'Get group profile picture URL',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/123456789@g.us/picture" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/123456789@g.us/picture", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/groups/{groupId}/invite-code',
        description: 'Get the group invite link/code',
        curl: `curl -X GET "http://localhost:3000/api/default/groups/123456789@g.us/invite-code" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/groups/123456789@g.us/invite-code", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/{groupId}/invite-code/revoke',
        description: 'Revoke and regenerate the invite link',
        curl: `curl -X POST "http://localhost:3000/api/default/groups/123456789@g.us/invite-code/revoke" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/123456789@g.us/invite-code/revoke", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/groups/{groupId}/settings/security/info-admin-only',
        description: 'Restrict group info editing to admins only',
        payload: `{"infoAdminOnly":true}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/groups/123456789@g.us/settings/security/info-admin-only" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"infoAdminOnly":true}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/groups/123456789@g.us/settings/security/info-admin-only", json={"infoAdminOnly":True}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'PUT', path: '/api/{session}/groups/{groupId}/settings/security/messages-admin-only',
        description: 'Restrict messaging to admins only',
        payload: `{"messagesAdminOnly":true}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/groups/123456789@g.us/settings/security/messages-admin-only" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"messagesAdminOnly":true}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/groups/123456789@g.us/settings/security/messages-admin-only", json={"messagesAdminOnly":True}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/{session}/groups/refresh',
        description: 'Refresh/reload all groups from WhatsApp',
        curl: `curl -X POST "http://localhost:3000/api/default/groups/refresh" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/groups/refresh", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
    ],
  },
  {
    name: 'Contacts',
    icon: '📇',
    description: 'Manage contacts, check WhatsApp presence, get profile pics, block/unblock.',
    endpoints: [
      {
        method: 'GET', path: '/api/contacts',
        description: 'Get contacts list for a session',
        curl: `curl -X GET "http://localhost:3000/api/contacts?session=default" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/contacts", params={"session":"default"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/contacts/all',
        description: 'List ALL contacts for a session',
        curl: `curl -X GET "http://localhost:3000/api/contacts/all?session=default" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/contacts/all", params={"session":"default"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/contacts/about',
        description: 'Get contact about/status info',
        curl: `curl -X GET "http://localhost:3000/api/contacts/about?session=default&chatId=919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/contacts/about", params={"session":"default","chatId":"919876543210@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/contacts/{id}',
        description: 'Get a specific contact by ID',
        curl: `curl -X GET "http://localhost:3000/api/default/contacts/919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/contacts/919876543210@c.us", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/contacts/check-exists',
        description: 'Check if a phone number is on WhatsApp',
        curl: `curl -X GET "http://localhost:3000/api/contacts/check-exists?session=default&phone=919876543210" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/contacts/check-exists", params={"session":"default","phone":"919876543210"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: 'Returns {"exists": true/false} for the given phone number.',
      },
      {
        method: 'GET', path: '/api/contacts/profile-picture',
        description: 'Get a contact\'s profile picture URL',
        curl: `curl -X GET "http://localhost:3000/api/contacts/profile-picture?session=default&chatId=919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/contacts/profile-picture", params={"session":"default","chatId":"919876543210@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/contacts/{chatId}',
        description: 'Update a contact\'s name',
        payload: `{"name":"Custom Name"}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/contacts/919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"name":"Custom Name"}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/contacts/919876543210@c.us", json={"name":"Custom"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
      {
        method: 'POST', path: '/api/contacts/block',
        description: 'Block a contact',
        payload: `{"session":"default","chatId":"919876543210@c.us"}`,
        curl: `curl -X POST "http://localhost:3000/api/contacts/block" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"session":"default","chatId":"919876543210@c.us"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/contacts/block", json={"session":"default","chatId":"919876543210@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})\n# Unblock\nr = requests.post("http://localhost:3000/api/contacts/unblock", json={"session":"default","chatId":"919876543210@c.us"}, headers={"X-Api-Key":"YOUR_API_KEY"})`,
      },
    ],
  },
  {
    name: 'Profile',
    icon: '👤',
    description: 'Manage your WhatsApp profile — name, picture, and status message.',
    endpoints: [
      {
        method: 'GET', path: '/api/{session}/profile',
        description: 'Get your WhatsApp profile info',
        curl: `curl -X GET "http://localhost:3000/api/default/profile" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/profile", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/profile/name',
        description: 'Update your WhatsApp display name',
        payload: `{"name":"My New Name"}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/profile/name" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"name":"My New Name"}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/profile/name", json={"name":"My New Name"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/profile/picture',
        description: 'Update your WhatsApp profile picture',
        payload: `{"file":{"url":"https://example.com/avatar.jpg"}}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/profile/picture" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"file":{"url":"https://example.com/avatar.jpg"}}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/profile/picture", json={"file":{"url":"https://example.com/avatar.jpg"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/profile/status',
        description: 'Update your WhatsApp status/about text',
        payload: `{"status":"Available on WhatsApp!"}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/profile/status" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"status":"Hello world!"}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/profile/status", json={"status":"Hello!"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
    ],
  },
  {
    name: 'Status / Stories',
    icon: '📖',
    description: 'Post and delete WhatsApp status updates (stories) — text, image, video, voice.',
    endpoints: [
      {
        method: 'POST', path: '/api/{session}/status/text',
        description: 'Post a text status/story',
        payload: `{"text":"Hello world!","backgroundColor":"#FF0000","font":1}`,
        curl: `curl -X POST "http://localhost:3000/api/default/status/text" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"text":"Hello world!"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/status/text", json={"text":"Hello!"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/status/image',
        description: 'Post an image status/story',
        payload: `{"file":{"url":"https://example.com/photo.jpg"},"caption":"My status"}`,
        curl: `curl -X POST "http://localhost:3000/api/default/status/image" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"file":{"url":"https://example.com/photo.jpg"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/status/image", json={"file":{"url":"https://example.com/img.jpg"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/status/video',
        description: 'Post a video status/story',
        payload: `{"file":{"url":"https://example.com/video.mp4"}}`,
        curl: `curl -X POST "http://localhost:3000/api/default/status/video" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"file":{"url":"https://example.com/video.mp4"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/status/video", json={"file":{"url":"https://example.com/video.mp4"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/status/voice',
        description: 'Post a voice note status/story',
        payload: `{"file":{"url":"https://example.com/audio.ogg"}}`,
        curl: `curl -X POST "http://localhost:3000/api/default/status/voice" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"file":{"url":"https://example.com/audio.ogg"}}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/status/voice", json={"file":{"url":"https://example.com/audio.ogg"}}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/status/delete',
        description: 'Delete a posted status/story',
        payload: `{"statusId":"STATUS_ID"}`,
        curl: `curl -X POST "http://localhost:3000/api/default/status/delete" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"statusId":"STATUS_ID"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/status/delete", json={"statusId":"STATUS_ID"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
    ],
  },
  {
    name: 'Presence',
    icon: '🟢',
    description: 'Set online/offline presence and subscribe to presence updates for contacts.',
    endpoints: [
      {
        method: 'POST', path: '/api/{session}/presence',
        description: 'Set your presence status (online, offline, typing, recording)',
        payload: `{"presence":"available"}`,
        curl: `curl -X POST "http://localhost:3000/api/default/presence" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"presence":"available"}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/presence", json={"presence":"available"}, headers={"X-Api-Key":"YOUR_API_KEY"})\n# Values: available, unavailable, composing, recording`,
      },
      {
        method: 'GET', path: '/api/{session}/presence/{chatId}',
        description: 'Get the current presence of a contact',
        curl: `curl -X GET "http://localhost:3000/api/default/presence/919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/presence/919876543210@c.us", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/presence/{chatId}/subscribe',
        description: 'Subscribe to presence updates for a contact (live "online" status)',
        curl: `curl -X POST "http://localhost:3000/api/default/presence/919876543210@c.us/subscribe" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/presence/919876543210@c.us/subscribe", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: 'After subscribing, presence changes come via webhook events.',
      },
    ],
  },
  {
    name: 'Labels',
    icon: '🏷️',
    description: 'Manage WhatsApp Business labels — CRUD operations for chat organization.',
    endpoints: [
      {
        method: 'GET', path: '/api/{session}/labels',
        description: 'List all labels',
        curl: `curl -X GET "http://localhost:3000/api/default/labels" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/labels", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/labels/chats/{chatId}',
        description: 'Get labels assigned to a specific chat',
        curl: `curl -X GET "http://localhost:3000/api/default/labels/chats/919876543210@c.us" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/labels/chats/919876543210@c.us", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'PUT', path: '/api/{session}/labels/{labelId}',
        description: 'Update a label (rename, change color, assign chats)',
        payload: `{"name":"Customers","color":1,"chatIds":["919876543210@c.us"]}`,
        curl: `curl -X PUT "http://localhost:3000/api/default/labels/LABEL_ID" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"name":"Customers","color":1}'`,
        python: `import requests\nr = requests.put("http://localhost:3000/api/default/labels/LABEL_ID", json={"name":"Customers","color":1}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/labels/{labelId}/chats',
        description: 'Get all chats with a specific label',
        curl: `curl -X GET "http://localhost:3000/api/default/labels/LABEL_ID/chats" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/labels/LABEL_ID/chats", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
    ],
  },
  {
    name: 'System / Server',
    icon: '⚙️',
    description: 'Server health, version, debug tools, and environment information.',
    endpoints: [
      {
        method: 'GET', path: '/api/server/version',
        description: 'Get WAHA server version',
        curl: `curl -X GET "http://localhost:3000/api/server/version" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/server/version", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/server/status',
        description: 'Get server status and uptime',
        curl: `curl -X GET "http://localhost:3000/api/server/status" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/server/status", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/server/environment',
        description: 'Get server environment/config details',
        curl: `curl -X GET "http://localhost:3000/api/server/environment" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/server/environment", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/server/stop',
        description: 'Gracefully stop the WAHA server',
        curl: `curl -X POST "http://localhost:3000/api/server/stop" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/server/stop", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: '⚠️ This shuts down the entire WAHA server.',
      },
      {
        method: 'GET', path: '/api/server/debug/cpu',
        description: 'Get CPU profile for debugging',
        curl: `curl -X GET "http://localhost:3000/api/server/debug/cpu" \\\n  -H "X-Api-Key: YOUR_API_KEY" --output cpu.profile`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/server/debug/cpu", headers={"X-Api-Key":"YOUR_API_KEY"})\nwith open("cpu.profile","wb") as f: f.write(r.content)`,
      },
      {
        method: 'GET', path: '/api/server/debug/heapsnapshot',
        description: 'Get heap snapshot for memory debugging',
        curl: `curl -X GET "http://localhost:3000/api/server/debug/heapsnapshot" \\\n  -H "X-Api-Key: YOUR_API_KEY" --output heap.heapsnapshot`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/server/debug/heapsnapshot", headers={"X-Api-Key":"YOUR_API_KEY"})\nwith open("heap.heapsnapshot","wb") as f: f.write(r.content)`,
      },
      {
        method: 'GET', path: '/api/server/debug/browser/trace/{session}',
        description: 'Get browser trace for a session (for debugging)',
        curl: `curl -X GET "http://localhost:3000/api/server/debug/browser/trace/default" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/server/debug/browser/trace/default", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/health',
        description: 'Simple health check (no auth required)',
        curl: `curl -X GET "http://localhost:3000/health"`,
        python: `import requests\nr = requests.get("http://localhost:3000/health")\nprint(r.status_code)`,
      },
      {
        method: 'GET', path: '/ping',
        description: 'Ping endpoint (no auth required)',
        curl: `curl -X GET "http://localhost:3000/ping"`,
        python: `import requests\nr = requests.get("http://localhost:3000/ping")\nprint(r.text)`,
      },
      {
        method: 'GET', path: '/api/version',
        description: 'Get WAHA version (alias for server version)',
        curl: `curl -X GET "http://localhost:3000/api/version" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/version", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/checkNumberStatus',
        description: 'Check number status on WhatsApp',
        curl: `curl -X GET "http://localhost:3000/api/checkNumberStatus?session=default&phone=919876543210" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/checkNumberStatus", params={"session":"default","phone":"919876543210"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/messages',
        description: 'Get messages across all chats (global query)',
        curl: `curl -X GET "http://localhost:3000/api/messages?session=default" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/messages", params={"session":"default"}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/apps',
        description: 'List installed WhatsApp business apps',
        curl: `curl -X GET "http://localhost:3000/api/apps" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/apps", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/apps/{id}',
        description: 'Get details of a specific business app',
        curl: `curl -X GET "http://localhost:3000/api/apps/APP_ID" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/apps/APP_ID", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'GET', path: '/api/{session}/new-message-id',
        description: 'Generate a new unique message ID',
        curl: `curl -X GET "http://localhost:3000/api/default/new-message-id" \\\n  -H "X-Api-Key: YOUR_API_KEY"`,
        python: `import requests\nr = requests.get("http://localhost:3000/api/default/new-message-id", headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
      },
      {
        method: 'POST', path: '/api/{session}/events',
        description: 'Subscribe to server-sent events (SSE) for real-time updates',
        curl: `curl -X POST "http://localhost:3000/api/default/events" \\\n  -H "X-Api-Key: YOUR_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"events":["message","session.status"]}'`,
        python: `import requests\nr = requests.post("http://localhost:3000/api/default/events", json={"events":["message","session.status"]}, headers={"X-Api-Key":"YOUR_API_KEY"})\nprint(r.json())`,
        note: 'Returns SSE stream. Connect via EventSource for real-time message & status updates.',
      },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  POST: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
  PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function EndpointCard({ endpoint, defaultExpanded }: { endpoint: Endpoint; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'python'>('curl');

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-app-bg rounded-xl border border-app-border overflow-hidden hover:border-app-border-hover transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-app-surface/50 transition-colors">
        <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${methodColors[endpoint.method]}`}>{endpoint.method}</span>
        <code className="text-app-text text-sm font-mono flex-1 truncate">{endpoint.path}</code>
        <ChevronDown className={`w-4 h-4 text-app-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-app-border animate-fade-in">
          <p className="text-app-text-secondary text-sm mt-3 mb-3">{endpoint.description}</p>
          {endpoint.payload && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">Payload</p>
              <div className="relative">
                <pre className="bg-app-surface border border-app-border rounded-lg p-3 text-xs text-app-text font-mono overflow-x-auto whitespace-pre">{endpoint.payload}</pre>
                <button onClick={() => copyCode(endpoint.payload!, 'payload')} className="absolute top-2 right-2 p-1.5 rounded-lg bg-app-bg border border-app-border text-app-text-muted hover:text-white transition-colors">
                  {copied === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
          {endpoint.note && (
            <div className="mb-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-400/80 text-xs">💡 {endpoint.note}</div>
          )}
          <div>
            <div className="flex gap-1 mb-2">
              <button onClick={() => setActiveTab('curl')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'curl' ? 'bg-[#1e2532] text-white' : 'text-app-text-muted hover:text-white'}`}>
                <Terminal className="w-3.5 h-3.5" /> cURL
              </button>
              <button onClick={() => setActiveTab('python')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'python' ? 'bg-[#1e2532] text-white' : 'text-app-text-muted hover:text-white'}`}>
                <Code className="w-3.5 h-3.5" /> Python
              </button>
            </div>
            <div className="relative">
              <pre className="bg-app-surface border border-app-border rounded-lg p-4 text-xs text-app-text font-mono overflow-x-auto whitespace-pre leading-relaxed">{activeTab === 'curl' ? endpoint.curl : endpoint.python}</pre>
              <button onClick={() => copyCode(activeTab === 'curl' ? endpoint.curl : endpoint.python, activeTab)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-app-bg border border-app-border text-app-text-muted hover:text-white transition-colors">
                {copied === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function APIReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Sessions', 'Messages']));

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  };

  const filtered = apiData.map(cat => ({
    ...cat,
    endpoints: cat.endpoints.filter(ep => ep.path.toLowerCase().includes(searchTerm.toLowerCase()) || ep.description.toLowerCase().includes(searchTerm.toLowerCase()) || ep.method.toLowerCase().includes(searchTerm.toLowerCase())),
  })).filter(cat => cat.endpoints.length > 0);

  const totalEndpoints = apiData.reduce((sum, cat) => sum + cat.endpoints.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-app-text flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-[#25D366]" />
            API Reference
          </h1>
          <p className="text-app-text-muted mt-1">{totalEndpoints} endpoints across {apiData.length} categories — with cURL & Python examples</p>
        </div>
        <a href="https://waha.devlike.pro/docs/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-app-surface border border-app-border text-sm text-app-text-secondary hover:text-white hover:border-app-border-hover transition-all">
          <ExternalLink className="w-4 h-4" /> Official Docs
        </a>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-app-surface border border-app-border text-white placeholder-app-text-muted focus:outline-none focus:border-[#25D366] transition-colors text-sm" placeholder="Search endpoints by path, method, or description..." />
      </div>

      <div className="flex gap-2 flex-wrap">
        {apiData.map(cat => (
          <a key={cat.name} href={`#category-${cat.name.toLowerCase().replace(/[ /]/g, '-')}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-surface border border-app-border text-app-text-secondary hover:text-white hover:border-app-border-hover text-xs transition-all">
            <span>{cat.icon}</span> {cat.name} <span className="text-app-text-muted">({cat.endpoints.length})</span>
          </a>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(category => {
          const isExpanded = expandedCategories.has(category.name);
          return (
            <div key={category.name} id={`category-${category.name.toLowerCase().replace(/[ /]/g, '-')}`}>
              <button onClick={() => toggleCategory(category.name)} className="w-full flex items-center justify-between p-4 rounded-xl bg-app-surface border border-app-border hover:border-app-border-hover transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left"><h2 className="text-app-text font-semibold text-lg">{category.name}</h2><p className="text-app-text-muted text-sm">{category.description}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-app-text-muted bg-app-bg px-2 py-0.5 rounded-full">{category.endpoints.length} endpoints</span>
                  <ChevronDown className={`w-5 h-5 text-app-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isExpanded && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {category.endpoints.map((ep, i) => (<EndpointCard key={`${ep.method}:${ep.path}`} endpoint={ep} defaultExpanded={i === 0} />))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-app-surface rounded-xl border border-app-border p-6">
        <h3 className="text-app-text font-semibold mb-3">🔐 Authentication</h3>
        <p className="text-app-text-secondary text-sm mb-3">All API requests require the <code className="px-1.5 py-0.5 rounded bg-app-bg text-[#25D366] text-xs">X-Api-Key</code> header with your WAHA API key.</p>
        <div className="bg-app-bg border border-app-border rounded-lg p-3">
          <pre className="text-xs text-app-text font-mono whitespace-pre-wrap">{`# Set in .env:\nWAHA_API_KEY=your-secret-api-key\n# Header:\nX-Api-Key: your-secret-api-key`}</pre>
        </div>
      </div>

      <div className="bg-app-surface rounded-xl border border-app-border p-6">
        <h3 className="text-app-text font-semibold mb-3">📝 Chat ID Format</h3>
        <div className="space-y-2 text-sm text-app-text-secondary">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-app-bg border border-app-border"><span className="text-emerald-400 font-mono text-xs mt-0.5">@c.us</span><span>Individual — <code className="px-1 py-0.5 rounded bg-[#1e2532] text-white text-xs">919876543210@c.us</code> (country code + number, no "+")</span></div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-app-bg border border-app-border"><span className="text-blue-400 font-mono text-xs mt-0.5">@g.us</span><span>Group — <code className="px-1 py-0.5 rounded bg-[#1e2532] text-white text-xs">123456789@g.us</code></span></div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-app-bg border border-app-border"><span className="text-purple-400 font-mono text-xs mt-0.5">@lid</span><span>Linked ID — <code className="px-1 py-0.5 rounded bg-[#1e2532] text-white text-xs">12345@lid</code></span></div>
        </div>
      </div>

      <div className="text-center pb-8">
        <p className="text-app-text-muted text-xs">Synced from WAHA OpenAPI spec. For latest updates visit <a href="https://waha.devlike.pro/docs/" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">waha.devlike.pro/docs</a> or <a href="https://github.com/devlikeapro/waha" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">GitHub</a></p>
      </div>
    </div>
  );
}
