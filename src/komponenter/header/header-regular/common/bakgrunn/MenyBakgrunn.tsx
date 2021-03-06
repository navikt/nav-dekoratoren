import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { lukkAlleDropdowns } from 'store/reducers/dropdown-toggle-duck';
import './MenyBakgrunn.less';

const MenyBakgrunn = () => {
    const dispatch = useDispatch();
    const toggles = useSelector((state: AppState) => state.dropdownToggles);
    const classname = 'meny-bakgrunn';
    const clsActive = ` ${classname}--active`;
    const isActive =
        toggles.hovedmeny ||
        toggles.minside ||
        toggles.sok ||
        toggles.undermeny ||
        toggles.varsler;

    return (
        <div
            className={`${classname}${isActive ? clsActive : ''}`}
            onClick={() => dispatch(lukkAlleDropdowns())}
        />
    );
};

export default MenyBakgrunn;
