import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/////////////// VERSION 2.0 FOR OPERATIONS ///////////////

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Add this log to see what's coming into the function
      console.log("CreateUser received args:", args);

      const existingUsers = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .collect();

      console.log("Existing users found:", existingUsers.length);

      if (existingUsers.length === 0) {
        // Create a new user
        const userId = await ctx.db.insert("users", {
          name: args.name,
          email: args.email,
          picture: args.picture,
          uid: args.uid,
          token: 50000,
        });

        // IMPORTANT: Log the user ID that was created
        console.log("New user created with ID:", userId);

        // Return a structured response object
        return { success: true, id: userId, isNew: true };
      } else {
        const existingUser = existingUsers[0];
        console.log("User already exists with ID:", existingUser._id);

        // Return a structured response with the existing user's ID
        return { success: true, id: existingUser._id, isNew: false };
      }
    } catch (error) {
      console.error("Error in CreateUser mutation:", error);

      // Return an error object that will be passed to client
      return { success: false, error: String(error) };
    }
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.userId, {
      token: args.token,
    });
    return result;
  },
});
