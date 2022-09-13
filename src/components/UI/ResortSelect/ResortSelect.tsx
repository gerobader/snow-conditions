/* eslint-disable no-underscore-dangle */
import React, {useState, useRef, useEffect} from 'react';
import TextInput from '../TextInput/TextInput';
import {SkiResort} from '../../../types';

import './ResortSelect.scss';

type ResortSelectProps = {
  skiResorts: SkiResort[]
  selectedResortId: string,
  setSelectedResortId: (val: string) => void
}

function ResortSelect({skiResorts, selectedResortId, setSelectedResortId}: ResortSelectProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showTopFadeOutElement, setShowTopFadeOutElement] = useState(false);
  const [showBottomFadeOutElement, setShowBottomFadeOutElement] = useState(true);
  const resortWrapper = useRef<HTMLDivElement>(null);
  const checkFadeOutElementVisibility = () => {
    if (resortWrapper.current === null) return;
    const {scrollTop, scrollHeight, offsetHeight} = resortWrapper.current;
    setShowTopFadeOutElement(scrollTop > 10);
    setShowBottomFadeOutElement(scrollTop + offsetHeight < scrollHeight - 10);
  };

  useEffect((): any => {
    if (resortWrapper.current === null) return null;
    const handleScroll = () => {
      if (resortWrapper.current === null) return;
      checkFadeOutElementVisibility();
    };
    resortWrapper.current.addEventListener('scroll', handleScroll);
    return () => {
      if (resortWrapper.current !== null) resortWrapper.current.removeEventListener('scroll', handleScroll);
    };
  }, [resortWrapper, checkFadeOutElementVisibility]);

  const filteredSkiResorts = skiResorts.filter((skiResort) => skiResort.name.includes(searchValue));
  return (
    <div className="resort-select">
      <div className="search-field">
        <TextInput value={searchValue} setValue={setSearchValue} placeholder="Search"/>
      </div>
      <div className={`fade-out top${showTopFadeOutElement ? ' show' : ''}`}/>
      <div className={`fade-out bottom${showBottomFadeOutElement ? ' show' : ''}`}/>
      <div className="resort-wrapper" ref={resortWrapper}>
        {filteredSkiResorts.map((skiResort) => (
          <div
            key={skiResort._id}
            className={`resort${selectedResortId === skiResort._id ? ' selected' : ''}`}
            onClick={() => setSelectedResortId(skiResort._id)}
          >
            {skiResort.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResortSelect;
