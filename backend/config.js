
import dotenv from 'dotenv';

dotenv.config();

export const { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_CALLBACK_URL, PORT, SESSION_SECRET } = process.env;
