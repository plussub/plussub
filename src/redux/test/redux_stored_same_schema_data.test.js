import './reduxConfigStoredWithSameSchemaMock.js';
import {getState} from '../redux.js';


it('should not reset state if stored schema version is unmodified', ()=> {
    //execute
    let resultState = getState();
    expect(resultState.schemaVersion).toBe(253);
    expect(resultState.some).toBe('data');
});