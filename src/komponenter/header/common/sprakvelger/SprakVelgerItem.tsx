import React from 'react';
import { LocaleOption } from './SprakVelger';
import { Bilde } from '../../../common/bilde/Bilde';
import { BodyShort } from '@navikt/ds-react';
import Cicle from 'ikoner/circle.svg';

import style from './SprakVelger.module.scss';

interface Props {
    index: number;
    item: LocaleOption;
    selectedItem: LocaleOption | null;
    onSelectedItemChange: any;
}

const SprakVelgerItem = (props: Props) => {
    const { selectedItem, index, onSelectedItemChange } = props;
    const { item } = props;

    const isItemSelected = selectedItem?.locale === item.locale;

    return (
        <li className={style.menuListItem}>
            <button
                className={style.option}
                data-index={index}
                onClick={onSelectedItemChange}
                aria-current={isItemSelected}
            >
                {isItemSelected && <Bilde asset={Cicle} className={style.sirkel} />}
                <BodyShort
                    as="span"
                    size="small"
                    lang={item.locale}
                    className={!isItemSelected ? style.notSelected : undefined}
                >
                    {item.label}
                </BodyShort>
            </button>
        </li>
    );
};

export default SprakVelgerItem;
