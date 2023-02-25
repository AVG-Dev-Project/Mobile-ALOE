import { createContext, useEffect, useState } from 'react';

export const Contexte = createContext();

export const ContexteProvider = (props) => {
   const [isSigned, setIsSigned] = useState(false);

   return (
      <Contexte.Provider value={{ isSigned, setIsSigned }}>
         {props.children}
      </Contexte.Provider>
   );
};
