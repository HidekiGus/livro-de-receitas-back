import * as likeService from "../src/services/likeService";
import * as likeRepository from "../src/repositories/likeRepository";
import * as jwtResolver from "../src/utils/jwtResolver";
import { describe, it } from "node:test";
import { expect, jest } from "@jest/globals";

describe("Tests the like services", () => {
  it("Tests the likeRecipe function", async () => {
    jest
      .spyOn(likeRepository, "likeRecipe")
      .mockImplementationOnce((): any => {});

    jest.spyOn(jwtResolver, "resolveJWT").mockImplementationOnce((): any => {});

    const result = await likeService.likeRecipe("authorization", 1);

    expect(likeRepository.likeRecipe).toBeCalled();
  });
});
