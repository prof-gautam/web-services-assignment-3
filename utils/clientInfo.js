const getClientInfo = (req) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress
    const deviceType = req.headers["user-agent"]
    return { ip, deviceType }
  } catch (error) {
    console.error("Error retrieving client info:", error)
    return null
  }
}

module.exports = getClientInfo
