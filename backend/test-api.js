const http = require("http");

const testRegister = () => {
  const data = JSON.stringify({
    name: "Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api/auth/register",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      console.log("Réponse:", JSON.parse(body));
    });
  });

  req.on("error", (error) => {
    console.error("Erreur:", error.message);
  });

  req.write(data);
  req.end();
};

testRegister();
