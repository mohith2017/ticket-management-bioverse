# Simple ticketing management system for Bioverse

### This is a ticketing system with Bioverse, working with React Hook forms, Zod, Tailwind CSS, Material UI and Firebase

## Demo
[Vercel Live Version](https://ticket-management-bioverse.vercel.app/)

### Screenshots

![Main page](https://i.postimg.cc/SK6vj32v/Screen-Shot-2023-11-23-at-7-51-11-AM.png)

![Admin page](https://i.postimg.cc/nry44VNY/Screen-Shot-2023-11-23-at-7-51-40-AM.png)

## Tech Stack

- [x] [Next.js](https://nextjs.org/)
- [x] [React Hook Form](https://react-hook-form.com/)
- [x] [Zod](https://zod.dev)
- [x] [TypeScript](https://www.typescriptlang.org/)
- [x] CSS with [Tailwind CSS](https://tailwindcss.com/)
- [x] Material UI [Material UI](https://mui.com)
- [x] Icons with [Material UI Icons]([https://react-icons.github.io/react-icons/](https://mui.com/material-ui/material-icons/))
- [x] Cloud firestore real-time storage with [Firebase](https://firebase.com)

## Workflow

End user:
- Create a ticket using the main app page with Email, Name and Description of the Issue
- Toggle between Admin and End user portal
- Logging of successfully completing submission

IMP NOTE: Response has to be >=10 characters

Admin
- List view of existing tickets - in order of most recently created ticket to least
- Respond to the user's ticket in real-time
- Change the status of the ticket in real-time 
- Real- time Database updation

Color code:
Red - New
Yellow - In Progress
Green - Resolved

## App Features

- [x] Submit Support ticket requests in real-time
- [x] Admin panel based Easy-to-view Ticket List interface
- [x] Respond to User's Tickets in real-time
- [x] Update User Ticket's status in real-time



## Routes

/ - Admin and User pages <br />
/api/admin - Admin Data Fetch API <br />
/api/form - User Ticketing API <br />
/api/response - Response Updation API <br />
/api/status - Status Updation API <br />

## App workflow

User => 
Create Ticket - Hit Submit - Real-time Upload to Firebase on backend

Admin =>
Real-time view of Tickets with ticket description and previous responses - Update responses through box - Submit through portal - Real-time updation to Firebase
Update status of tickets - Real-time updation to Firebase - Color coding and heading for status


## How to use

### Prerequisites

- Clone the repository and install the dependencies.

### Install dependencies

```bash
npm install
# or
yarn
```

### Run the development server:

```bash
npm run dev
# or
yarn dev
```

### Build the app

```bash
npm run build
# or
yarn build
```

### Run the production server:

```bash
npm run start
# or
yarn start
```

Tested with Node.js v18.12.1.
