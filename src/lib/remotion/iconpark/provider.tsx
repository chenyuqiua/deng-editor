import { Script } from '../../../component/script'

/**
 * inject iconpark script
 */
export function IconParkProvider({
  children,
  jsUrl,
}: {
  children: React.ReactNode
  jsUrl: string
}) {
  return (
    <>
      <Script src={jsUrl}></Script>
      {children}
    </>
  )
}
