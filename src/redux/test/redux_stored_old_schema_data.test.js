import './reduxConfigStoredWithOldSchemaMock.js';
import {getState} from '../redux.js';


it('should reset state if initial schema version is higher than stored schema version', ()=> {

    //execute
    let resultState = getState();
    expect(resultState.schemaVersion).toBe(253);
    expect(resultState.option.subtitleLine).toBe('auto');
});