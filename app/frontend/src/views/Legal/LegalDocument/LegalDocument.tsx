import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import styles from './LegalDocument.module.scss';

type LegalSection = {
    title: string;
    body: string[];
};

type LegalDocumentProps = {
    translationKey: 'PrivacyPolicy' | 'TermsOfService';
};

export const LegalDocument = ({ translationKey }: LegalDocumentProps) => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);

    const sections = t(`${translationKey}.sections`, {
        returnObjects: true,
    }) as LegalSection[];

    return (
        <div className={styles.LegalDocument}>
            <div className={styles.LegalDocument__logo}>
                {theme === 'light' ? (
                    <LogoBlue height={40} width={110} />
                ) : (
                    <LogoBlueDarkTheme height={40} width={110} />
                )}
            </div>
            <div className={styles.LegalDocument__content}>
                <Link to="/register" className={styles.LegalDocument__back}>
                    <ArrowLeft width={16} height={16} />
                    <span>{t(`${translationKey}.backButton`)}</span>
                </Link>

                <h1 className={styles.LegalDocument__title}>
                    {t(`${translationKey}.title`)}
                </h1>
                <p className={styles.LegalDocument__updated}>
                    {t(`${translationKey}.lastUpdated`)}
                </p>

                {sections.map((section) => (
                    <section
                        key={section.title}
                        className={styles.LegalDocument__section}
                    >
                        <h2 className={styles.LegalDocument__sectionTitle}>
                            {section.title}
                        </h2>
                        {section.body.map((paragraph) => (
                            <p
                                key={paragraph}
                                className={styles.LegalDocument__paragraph}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
};
