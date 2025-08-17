import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Print Orders table
  PrintOrder: a
    .model({
      id: a.id().required(),
      files: a.string().array(), // File keys from S3 storage
      paperType: a.string().required(),
      colorOption: a.string().required(),
      printSides: a.string().required(),
      binding: a.string(),
      quantity: a.integer().required(),
      totalPages: a.integer().required(),
      totalPrice: a.float().required(),
      status: a.string().default('pending'),
      customerEmail: a.string(),
      customerPhone: a.string(),
      notes: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),

  // File Metadata table
  FileMetadata: a
    .model({
      id: a.id().required(),
      fileName: a.string().required(),
      fileSize: a.integer().required(),
      fileType: a.string().required(),
      s3Key: a.string().required(),
      pageCount: a.integer(),
      orderId: a.id(),
      uploadedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),

  // Print Settings template
  PrintSettings: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      paperType: a.string().required(),
      colorOption: a.string().required(),
      printSides: a.string().required(),
      binding: a.string(),
      isDefault: a.boolean().default(false),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
