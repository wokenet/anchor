// via https://github.com/gregberge/svgr/issues/38#issuecomment-359218610
interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}
declare module '*.svg' {
  const value: SvgrComponent
  export default value
}

declare module '*.png' {
  export default string
}

declare module '*.mp4' {
  export default string
}
