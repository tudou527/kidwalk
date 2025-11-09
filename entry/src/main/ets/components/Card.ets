@Component
export default struct CustomList {
  private scroller: Scroller = new Scroller()
  private arr: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  build() {
    Column() {
      Scroll(this.scroller) {
        Column() {
          ForEach(this.arr, (item: number) => {
            ListItem() {
              Flex({ direction: FlexDirection.Row }) {
                Text('>>>' + item)
                  .margin({ left: 16, right: 16, top: 16 })
                  .width('100%')
                  .height(80)
                  .fontSize(16)
                  .textAlign(TextAlign.Center)
                  .borderRadius(10)
                  .backgroundColor(Color.Orange)
              }
            }
          }, (item: number) => item.toString())
        }
      }
    }

  }
}