@Component
export default struct CustomCard {
  // 描述
  @Prop text: string = '>>>';

  build() {
    Flex({ direction: FlexDirection.Row }) {
      Text('>>>' + this.text)
        .margin({ left: 16, right: 16, top: 16 })
        .flexBasis('auto')
        .height(80)
        .fontSize(16)
        .textAlign(TextAlign.Center)
    }
    .margin({
      top: 0,
      right: 16,
      bottom: 16,
      left: 16
    })
    .flexBasis('auto')
    .height(80)
    .borderRadius(10)
    .backgroundColor('#EFEFEF')
  }
}