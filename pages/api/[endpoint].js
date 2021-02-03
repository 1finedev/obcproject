export default function handler(req, res) {
  const { endpoint } = req.query;
  res.status(400).json({
    status: "error",
    msg: `No handler defined for /${endpoint} route!`,
  });
}
