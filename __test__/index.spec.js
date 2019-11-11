import React from "react";
import {create, act} from 'react-test-renderer';

import AnimateNumber from '../lib/index';

describe('AnimateNumber', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component = null;

  it('should render', () => {
    component = create(<AnimateNumber value={10}/>).toJSON();
    expect(component).toMatchSnapshot();
  });
});
