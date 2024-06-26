import { finnTekst } from 'tekster/finn-tekst';
import { Locale } from 'store/reducers/language-duck';
import React from 'react';
import { verifyWindowObj } from 'utils/Environment';
import { Search } from '@navikt/ds-react';
import './SokInput.scss';

type Props = {
    className: string;
    writtenInput: string;
    language: Locale;
    audience: string;
    onChange: (value: string) => void;
    onReset: () => void;
    id: string;
};
export const SokInput = (props: Props) => {
    const { className, writtenInput, language, audience, onChange, onReset, id } = props;
    // Only set the input value in the browser, to prevent execution-order
    // dependent SSR warnings under certain circumstances
    const inputValue = verifyWindowObj() ? writtenInput || '' : undefined;

    return (
        <Search
            id={id}
            variant="primary"
            onChange={(value) => onChange(value)}
            onClear={onReset}
            className={className}
            value={inputValue}
            maxLength={100}
            type="text"
            hideLabel={false}
            label={finnTekst('sok-knapp-sokefelt', language, audience)}
            autoComplete="off"
        />
    );
};
export default SokInput;
