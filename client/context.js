import { createContext, useState } from 'react';

export const userContext = createContext({ user: {}, setUser: () => { } });