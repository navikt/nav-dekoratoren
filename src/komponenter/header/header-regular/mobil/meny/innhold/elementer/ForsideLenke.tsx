import React from 'react';
import { MenuValue } from 'utils/meny-storage-utils';
import BEMHelper from 'utils/bem';
import Tekst from 'tekster/finn-tekst';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { valgtbedrift } from 'komponenter/common/arbeidsflate-lenker/hovedmeny-arbeidsflate-lenker';
import { LenkeMedSporing } from 'komponenter/common/lenke-med-sporing/LenkeMedSporing';

interface Props {
    arbeidsflate: MenuValue;
    erInnlogget: boolean;
}

const ForsideLenke = (props: Props) => {
    const cls = BEMHelper('forsideLenke');
    const { DITT_NAV_URL, MINSIDE_ARBEIDSGIVER_URL } = useSelector((state: AppState) => state.environment);

    if (!props.erInnlogget) {
        return null;
    }

    return (
        <>
            {props.arbeidsflate === MenuValue.PRIVATPERSON && (
                <div className={cls.className}>
                    <Undertittel className={cls.element('ingress')}>
                        <Tekst id="min-side" />
                    </Undertittel>
                    <LenkeMedSporing href={DITT_NAV_URL} className={cls.element('lenke')}>
                        <Tekst id="til-forsiden" />
                    </LenkeMedSporing>
                </div>
            )}
            {props.arbeidsflate === MenuValue.ARBEIDSGIVER && (
                <div className={cls.className}>
                    <Undertittel className={cls.element('ingress')}>
                        <Tekst id="min-side-arbeidsgiver" />
                    </Undertittel>
                    <LenkeMedSporing href={MINSIDE_ARBEIDSGIVER_URL + valgtbedrift()} className={cls.element('lenke')}>
                        <Tekst id="ga-til-min-side-arbeidsgiver" />
                    </LenkeMedSporing>
                </div>
            )}
        </>
    );
};

export default ForsideLenke;
