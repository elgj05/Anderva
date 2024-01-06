import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';

/**
 * Usage:
 *
 * const [debouncedValue, setValue, actualValue] = useDebounce('', 1000)
 *
 */
export const useDebounce = (initialValue = '', delay) => {
  const [actualValue, setActualValue] = useState(initialValue);
  const [debounceValue, setDebounceValue] = useState(initialValue);

  useEffect(() => {
    const debounceId = setTimeout(() => setDebounceValue(actualValue), delay);
    return () => clearTimeout(debounceId);
  }, [actualValue, delay]);

  return [debounceValue, setActualValue, actualValue];
};

export const getYoutubeId = url => {
  var myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
  return myregexp.exec(url);
};

export const openUrl = url => {
  Linking.canOpenURL(url).then(yes => {
    if (yes) {
      Linking.openURL(url);
    }
  });
};
