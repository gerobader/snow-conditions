/* eslint-disable no-underscore-dangle */
import React from 'react';
import ResortSelect from '../UI/ResortSelect/ResortSelect';
import {SkiResort} from '../../types';

import './UserInputs.scss';

type UserInputsProps = {
  skiResorts: SkiResort[]
  selectedResortId: string,
  setSelectedResortId: (val: string) => void
}

function UserInputs({skiResorts, selectedResortId, setSelectedResortId}: UserInputsProps) {
  return (
    <div className="user-inputs">
      <div className="input-wrapper">
        <ResortSelect skiResorts={skiResorts} selectedResortId={selectedResortId} setSelectedResortId={setSelectedResortId}/>
      </div>
      <div className="connector"/>
    </div>
  );
}

export default UserInputs;
