import './reduxConfigWithoutStoredDataMock.js';
import {getState} from '../redux.js';


it('should take initial state if no state are stored', () => {
    //execute
    let resultState = getState();
    expect(resultState.schemaVersion).toBe(253);
    expect(resultState.option.subtitleLine).toBe('auto');

});