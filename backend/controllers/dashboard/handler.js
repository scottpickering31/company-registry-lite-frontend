const handleControllerError = (res, error, defaultMessage, mapError) => {
  if (error?.statusCode) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const mapped = mapError ? mapError(error) : null;
  if (mapped) {
    res.status(mapped.statusCode).json({ message: mapped.message });
    return;
  }

  console.error(defaultMessage, error);
  res.status(500).json({ message: defaultMessage });
};

const createHandler = ({
  handler,
  defaultMessage,
  successStatus = 200,
  mapError,
}) => {
  return async (req, res) => {
    try {
      const payload = await handler(req, res);
      if (res.headersSent || payload === undefined) {
        return;
      }
      res.status(successStatus).json(payload);
    } catch (error) {
      handleControllerError(res, error, defaultMessage, mapError);
    }
  };
};

module.exports = {
  createHandler,
};
