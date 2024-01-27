import { IGenericErrorResponse } from '../interfaces/common';

const handleValidationError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
): IGenericErrorResponse => {
  const lines = error.message.trim().split('\n');
  // console.log(lines[lines.length - 1])

  const errors = [
    {
      path: '',
      message: lines[lines.length - 1],
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
