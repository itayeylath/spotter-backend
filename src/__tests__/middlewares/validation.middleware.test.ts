import { validate } from "../../middlewares/validation.middleware";
import { mockRequest, mockResponse, mockNext } from "../utils";
import { z } from "zod";

describe("Validation Middleware", () => {
  const testSchema = z.object({
    body: z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    }),
    params: z.object({
      id: z.string().min(1),
    }),
    query: z.object({
      page: z.string().optional(),
    }),
  });

  it("should pass validation with valid data", async () => {
    const req = mockRequest(
      { title: "Test Title", description: "Test Description" },
      { id: "123" },
      { page: "1" }
    );
    const res = mockResponse();
    const next = mockNext();

    await validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should fail validation with invalid body data", async () => {
    const req = mockRequest(
      { title: "", description: "Test Description" }, // Empty title
      { id: "123" },
      { page: "1" }
    );
    const res = mockResponse();
    const next = mockNext();

    await validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 })
    );
  });

  it("should fail validation with invalid params", async () => {
    const req = mockRequest(
      { title: "Test Title", description: "Test Description" },
      { id: "" }, // Empty id
      { page: "1" }
    );
    const res = mockResponse();
    const next = mockNext();

    await validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 })
    );
  });

  it("should handle missing optional fields", async () => {
    const req = mockRequest(
      { title: "Test Title" }, // Missing description
      { id: "123" },
      {} // Missing page
    );
    const res = mockResponse();
    const next = mockNext();

    await validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
