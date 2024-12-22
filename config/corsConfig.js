export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-domain.com",
  ], // List allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specific methods
  allowedHeaders: ["Content-Type", "Authorization"], // List allowed headers
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  preflightContinue: false, // Disable passing preflight to the next middleware
  optionsSuccessStatus: 200, // For legacy browser support (e.g., older IE)
};
