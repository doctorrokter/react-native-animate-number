import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
} from 'react-native';

const HALF_RAD = Math.PI / 2;

const TimingFunctions = {
  linear: (interval, progress) => {
    return interval;
  },

  easeOut: (interval, progress) => {
    return interval * Math.sin(HALF_RAD * progress) * 5;
  },

  easeIn: (interval, progress) => {
    return interval * Math.sin((HALF_RAD - HALF_RAD * progress)) * 5;
  },
};

function AnimateNumber({value, timing, interval, steps, countBy, onFinish, formatter, onProgress, runOnMount, ...rest}) {
  const [innerValue, setInnerValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

  const initialValue = useRef(value);
  const startFrom = useRef(0);
  const endWith = useRef(0);
  const dirty = useRef(false);
  const direction = useRef(true);

  useEffect(() => {
    if (runOnMount) {
      prepareToAnimate(innerValue, value);
      startAnimate();
    } else {
      setInnerValue(value);
      setDisplayValue(value);
    }
  }, []);

  useEffect(() => {
    if (initialValue.current !== value) {
      prepareToAnimate(initialValue.current, value);
      startAnimate();
      initialValue.current = value;
    }
  }, [value]);

  useEffect(() => {
    if (dirty.current) {
      if (direction.current) {
        if (parseFloat(innerValue) <= parseFloat(value)) {
          startAnimate();
        }
      } else {
        if (parseFloat(innerValue) >= parseFloat(value)) {
          startAnimate();
        }
      }
    }
  }, [innerValue]);

  function prepareToAnimate(startFromValue, endWithValue) {
    startFrom.current = startFromValue;
    endWith.current = endWithValue;
    dirty.current = true;
  }

  function getAnimationProgress() {
    return (innerValue - startFrom.current) / (endWith.current - startFrom.current);
  }

  function startAnimate() {
    const progress = getAnimationProgress();

    let t = setTimeout(() => {
      clearTimeout(t);

      requestAnimationFrame(() => {
        let value = (endWith.current - startFrom.current) / steps;
        let sign = value >= 0 ? 1 : -1;

        value = sign * Math.abs(countBy);

        let total = parseFloat(innerValue) + parseFloat(value);

        direction.current = value > 0;
        // animation terminate conditions
        if (((direction.current) ^ (total <= endWith.current)) === 1) {
          dirty.current = false;
          total = endWith.current;
          onFinish(total, formatter(total));
        }

        onProgress(innerValue, total);

        setInnerValue(total);
        setDisplayValue(formatter(total));
      });

    }, TimingFunctions[timing](interval, progress));
  }

  return (
    <Text {...rest}>
      {displayValue}
    </Text>
  );
}

AnimateNumber.propTypes = {
  countBy: PropTypes.number,
  interval: PropTypes.number,
  steps: PropTypes.number,
  value: PropTypes.number,
  timing: PropTypes.oneOf(['linear', 'easeOut', 'easeIn']),
  formatter: PropTypes.func,
  onProgress: PropTypes.func,
  onFinish: PropTypes.func,
  runOnMount: PropTypes.bool,
};

AnimateNumber.defaultProps = {
  countBy: 1,
  interval: 14,
  steps: 45,
  value: 0,
  timing: 'linear',
  formatter: (value) => value,
  onProgress: () => {},
  onFinish: () => {},
  runOnMount: true,
};

export {
  AnimateNumber,
};

export default AnimateNumber;
