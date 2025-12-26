# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install any needed packages
RUN pnpm install

# Bundle app source
COPY . .

# Build the Next.js application
RUN pnpm build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app
CMD [ "pnpm", "start" ]