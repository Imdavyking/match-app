# Backend

**Match** is a decentralized application (dApp) built on the Solana platform that connects buyers with sellers, allowing them to find the best deals on products and services. Using smart contracts on Solana, Match ensures secure, transparent, and efficient transactions between parties.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Kingsmen-hackers/match-app
   ```
2. Install dependencies:
   ```
   cd match-app/backend
   yarn
   ```
3. Configure X Request API credentials:
   - Obtain your X Request API credentials from the X Developer Portal.
   - Open the `.env` file and update the following values with your credentials:
     ```
        MONGO_URI=
        NODE_ENV=
        HUGGINGFACE_API_KEY=
        JWT_SECRET=
        PORT=
        FRONTEND_URL=
     ```
4. **Start the application** with Docker:

   - Ensure you have Docker installed and running.
   - To bring up the backend and related services (MongoDB and Redis), run:
     ```bash
     docker-compose up
     ```
   - This will start the application on `localhost:3000`.

5. Alternatively, **start the application locally** without Docker:
   - Make sure Redis is running locally or on a remote server.
   - If you're using Redis locally, you can start it with the following command:
     ```bash
     redis-server
     ```
   - Then, start the application:
     ```
     yarn dev
     ```

## Usage

### Post LLM request

**Endpoint:** `POST /api/llm`

**Example Request:**

```bash
curl -X POST "${SERVER_URL}/api/llm" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer XXXXXXXX)" \
     -d '{"task": "your_task_here"}'
```

**Example Response:**

```json
{
  "content": "",
  "tool_calls": [
    {
      "name": "addPoints",
      "args": {
        "weight": 10,
        "points": 50,
        "tokenAddress": "0x123456789abcdef",
        "amountInUsd": 100
      },
      "type": "tool_call",
      "id": "unique_id_1"
    }
  ]
}
```

## Contributing

Contributions to the Match Backend System are welcome! If you have any suggestions, bug reports, or feature requests, please create an issue in the GitHub repository. If you would like to contribute code, please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/Kingsmen-hackers/match-app/blob/main/LICENSE).
