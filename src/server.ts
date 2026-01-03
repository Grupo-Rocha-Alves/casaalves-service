import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=== CASA ALVES Service ===`);
    console.log(`Server is running on http://localhost:${PORT}`);
});
