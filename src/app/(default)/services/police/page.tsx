import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from '@/app/(default)/services/page.module.css';
import { generatePolicePageMetadata } from '@/lib/metadata';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
    return generatePolicePageMetadata();
}

export default async function PolicePage() {
    return (
        <>
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.fullWidthColumn}>
                        <article className={styles.articleContent} style={{ marginTop: 0 }}>
                            <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Police Consulting Services</h1>
                                <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>Strategic AI and technology consulting for law enforcement operations. Professional guidance for mission-critical police systems.</p>
                            </section>

                            <section className={styles.asciiArtSection}>
                                <pre className={styles.asciiArt}>
                                    {`                                                                             ---                                                                  
                                                                          :-=+***+                                                                
                                                                         -==+**##*                                                                
                                                                        :-==+*####                                                                
                                                                        :-++*####*                                                                
                                                                       ::-=*#####*                                                                
                                                                       ::-=*#####*                                                                
                                                                       :-=+**####+                                                                
                                                                       :-=+*##%%#+                                                                
                                                                       :--=+*####*                                                                
                                                                       ::-==+*###*                                                                
                                                                       ::--=+*###*                                                                
                                                                       ::--=+*###*+                                                               
                                                                       ::--=*####**                                                               
                                                                       ::--+*#####*                                                               
                                                                       ::--+*#####*                                                               
                                                                --===++=---+*######*                                                              
                                                               --=+++**#=--+*######+                                                              
                                                        ::-==:--=++***##+--+*######++***+-                                                        
                                                      :::-==++++++++**##%--=*############*=::                                                     
                                                     :::--=++*##*+++**##%+-=+*############*:    =++                                               
                                                    ::::-==+*#%#**++**##%#==+*#############+ +****##*                                             
                                                  :::-====+*##%++++++*##%#+==+*#####%%#######%########                                            
                                                 ::--==****####==+++**##%#*==+**####%%%#####%%########*                                           
                                                :-=++++**####%+==+***###%%#==+**#####%%%####%%%##*######                                          
                                                :-=++***####%#=-=+***###%%#+=++*#####%%%%####%%%#*######                                          
                                                :--=+**######+---+***###%%#+++++*####%%%#####%@%##*#####*                                         
                                                 :--+**####%#=---=***####%#++++=*####%%%%#*###%%%#*#####*                                         
                                                :::-=++***#%*-:--+++*######*++==+#####%%%#*#####%########*                                        
                                                :::-==++**##=:::-++**######**+==+*####%%%#*#####%%########                                        
                                                :::-==+++*#+-:::==+***######*+===*####%%%#*######%%#######*                                       
                                                ::::-==+*#+:::::=+*+**######*+===*####%%%#########%########                                       
                                                 ::-:-=+**--::::--=+**###%##+=-==*#####%%#########%########                                       
                                                  ::---+*+-:::::-====+**###*+=-=+*#####%%##*#############**                                       
                                                    ::-++==-::-::-++===+****+=-==*****###*****************                                        
                                                      :----=:-----:-+===++*++=--=++*++++**+++++++++++++***                                        
                                                        ::---:==---:---=++++=====+**+++=++*+++++**++**#*                                          
                                                          -----===-::-=+++++==-=++***+++++***++*****#%@@                                          
                                                          ------==--====+++====++++++++++++*++****#%@@@%                                          
                                                            --:--====---=+++==++++++++++++++****#%@@@@%%                                          
                                                              -:-++=-----=++==+++++++++++=*++*#%@@@@@%*                                           
                                                              ---+*+==----====+++++++*+=++***%%@@@@%#                                             
                                                               ---+**+=--=====+++++**+++**+#%%@@@##                                               
                                                               -----=++++====+++++*+++****#%%%%%                                                  
                                                                  --:::-=++++***++******###%%%                                                    
                                                                    -::-=-=++****++++++**###                                                      
                                                                    ::        +++++`}
                                </pre>
                            </section>

                            <nav className={styles.articleContent} style={{ marginTop: '4rem' }}>
                                <div className={styles.backLink}>
                                    <Link href="/services/">← Back to All Services</Link>
                                </div>
                            </nav>
                        </article>
                    </div>
                </div>
            </main>
            <Footer
                language="en"
                currentPath="/services/police/"
                availableLanguages={['en']}
            />
        </>
    );
}

