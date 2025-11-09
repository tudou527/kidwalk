import { SymbolGlyphModifier } from '@kit.ArkUI';
import CustomCard from '../components/CustomCard';

@Entry
@Component
struct NavigationExample {
  private scroller: Scroller = new Scroller()
  private arr: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  build() {
    Column() {
      Navigation() {
        Row() {
          Scroll(this.scroller) {
            Flex({
              direction: FlexDirection.Row,
              wrap: FlexWrap.Wrap,
              justifyContent: FlexAlign.SpaceBetween,
              alignItems: ItemAlign.Start,
            }) {
              ForEach(this.arr, (item: number) => {
                // ListItem() {
                CustomCard({ text: item.toString() });
                // }
              }, (item: number) => item.toString())
            }
          }
          .padding({ top: 16 })
          .width('100%')
          .height('100%')
          .align(Alignment.Top)
        }
        .width('100%')
        .height('100%')
        .padding({ bottom: 16 })
      }
      .title(
        {
          main: '我的',
          sub: '我的遛娃地图'
        },
        {
          backgroundBlurStyle: BlurStyle.BACKGROUND_REGULAR,
        }
      )
      .menus([
        {
          value: "设置",
          symbolIcon: new SymbolGlyphModifier($r('sys.symbol.add_songlist')).fontColor([Color.Red])
            .fontSize(16)
            .fontWeight(FontWeight.Regular),
          isEnabled: true,
        },
        {
          value: "设置",
          symbolIcon: new SymbolGlyphModifier($r('sys.symbol.a_5k_rectangle')).fontColor([Color.Red])
            .fontSize(16)
            .fontWeight(FontWeight.Regular),
          isEnabled: true,
        }
      ])
      .titleMode(NavigationTitleMode.Free)
      .hideTitleBar(false)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}
