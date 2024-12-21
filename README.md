# Rothkopf Online Games Client

This repository holds the code for the client. There is a [separate repository](https://github.com/michaelrothkopf/rog-server) for the server code.

## Structure

| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [components](src/components)    | The common React components between pages                            |
| [core](src/core)                | Server relations logic and non-Zustand global variables              |
| [hooks](src/hooks)              | Zustand global state management stores                               |
| [pages](src/pages)              | Individual webpage components and styles                             |
| [pages/games](src/pages/games)  | Game components, styles, logic, and rendering                        |

## Technologies and Stack

The client uses TypeScript, React, Vite, and Zustand to handle rendering and state management.

This stack allows for easy management of authentication data and game state between components and pages.

For more detailed information on the application structure, see the [server repository](https://github.com/michaelrothkopf/rog-server).