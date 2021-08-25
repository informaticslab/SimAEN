/*
# DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

# This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
# Any opinions,findings, conclusions or recommendations expressed in this material are those
# of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

# (c) 2021 Massachusetts Institute of Technology.

# The software/firmware is provided to you on an As-Is basis

# Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
# or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
# are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
# other than as specifically authorized by the U.S. Government may violate any copyrights that
# exist in this work.

# Copyright (c) 2021 Massachusetts Institute of Technology
# SPDX short identifier: MIT

# Developed as part of: SimAEN, 2021
*/

import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { FormType } from '../models';

export const ComparisonContext = createContext<{compareForms: FormType[], setCompareForms: Dispatch<SetStateAction<FormType[]>>}>({
  compareForms: [],
  setCompareForms: () => {}
});

interface ComparisonProviderProps {
    children?: ReactNode;
}

export default function ComparisonProvider(props: ComparisonProviderProps) {
  const { children } = props;
  const [compareForms, setCompareForms] = useState<FormType[]>([]);

  return (
    <ComparisonContext.Provider value={{compareForms, setCompareForms}}>
      {children}
    </ComparisonContext.Provider>
  )
}