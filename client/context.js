import { createContext } from 'react';

export const userContext = createContext({ user: null, setUser: () => { } });
export const teamContext = createContext({ team: null, setTeam: () => { } });
export const pageContext = createContext({ current: null });
export const dragContext = createContext();