
## react-calendar日历源码解析

> ant-design 的日历源码，代码里使用了大量的moment()的API，需要对moment()的使用比较了解。

### 架构

首先看下组件的组成部分：

<img src="https://buynao.oss-cn-beijing.aliyuncs.com/1.png?Expires=1583386706&OSSAccessKeyId=TMP.hiH62WU5RCj7Z47LVVqPDLsrfMzRE3vDWLpP3HBkCEbQk99yGBei32ivgZChakbbtj9dNGyHrMb6PmDkFL74FpVBqDD8tUz3fry3YxKg7zqpddMFdj84xkDnBbPNR2.tmp&Signature=bFnt9X78njIVVYi161mc7Il3RlE%3D" width="288"/>

#### 源码结构如下：


```
      <div className={`${prefixCls}-panel`} key="panel">
        <DateInput {...props} />
        <div
          tabIndex={this.props.focusablePanel ? 0 : undefined}
          className={`${prefixCls}-date-panel`}
        >
          <CalendarHeader {...props} />
          <div className={`${prefixCls}-body`}>
            <DateTable {...props} />
          </div>

          <CalendarFooter {...props} />
        </div>
      </div>
```

秉承着带问题看源码的思路，我们先根据每个组件的单独部分，自己给自己提一个问题（xx功能如何实现？），然后在去看源码的实现：

## <DateTable\/\>
首先我们看一下，<DateTable\/\>的渲染部分，也就是**日期主体的渲染**，是如何进行的。

先看下<DateTable\/\>的组成：

```
interface DateTableProps extends DateTHeadProps, DateTBodyProps {
  prefixCls?: string;
  locale?: { [key: string]: any }; // 语言包
}

const DateTable: React.FC<DateTableProps> = props => {
  const { prefixCls } = props;
  return (
    <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
      <DateTHead {...props} />
      <DateTBody {...props} />
    </table>
  );
};
```

显然，我们应该继续去看<DateTBody \/\>的构造：

这个组件一共有270行左右，我就不把[源码](https://github.com/react-component/calendar/blob/master/src/date/DateTBody.tsx)全部贴出来了，直贴核心部分：

```
// 首先看下props的相关定义：
export interface DateTBodyProps {
  // 自定义渲染 <日期单元> 的方法
  dateRender?: (current: Moment, value: Moment) => ReactNode;
  // 自定义渲染 <日期单元 - 日期> 的方法
  contentRender?: (current: Moment, value: Moment) => ReactNode;
  // 当前日期
  value?: Moment;
  // 显示当周是今年第几周
  showWeekNumber?: boolean;
  // 面板上选中的时间
  selectedValue?: Moment | Moment[];
  // 外部传递的类名
  prefixCls?: string;
  // 判断当前日期是否禁止点击
  disabledDate?: (next: Moment, value: Moment) => boolean;
  // hover时默认的选中日期
  hoverValue?: Moment[];
  // 日期的onClick回调
  onSelect?: any;
  // 日期的onMouseEnter回调
  onDayHover?: (current: Moment | null, value: Moment) => void;
}
// 渲染逻辑
  let iIndex;
  let jIndex;
  let current: Moment;
  const today = getTodayTime(value); // 获取当前时间
  const dateTable: Moment[] = []; // 当前面板的日期容器

  const month1 = value.clone();
  month1.date(1); // 设置为当前第一天
  const day = month1.day(); // 当前第一天为星期几

  // 一个星期有7天,获取{day}之前的天数，加一起为7天，即一行
  const lastMonthDiffDay = (day + 7 - value.localeData().firstDayOfWeek()) % 7;
  const lastMonth1 = month1.clone();

  // 减去对应天数，取第一行（7天）的第一天
  lastMonth1.add(0 - lastMonthDiffDay, 'days');

  let passed = 0; // 天数递增标记

  /*
    DateConstants.DATE_ROW_COUNT = 7   => 一行
    DateConstants.DATE_COL_COUNT = 6   => 一列
    面板需要渲染的天数即为：6 * 7 = 42;
    面板的第一天即为上述计算得到的 lastMonth1;
    依次添加至dateTable中，方便后续进行渲染
  */
  for (iIndex = 0; iIndex < DateConstants.DATE_ROW_COUNT; iIndex += 1) {
    for (jIndex = 0; jIndex < DateConstants.DATE_COL_COUNT; jIndex += 1) {
      current = lastMonth1;
      if (passed) {
        current = current.clone();
        current.add(passed, 'days');
      }
      dateTable.push(current);
      passed += 1;
    }
  }

  /*
    开始dom的渲染
  */

  const tableHtml = []; // 日期的dom容器
  passed = 0; // 恢复至第一个 =>  dateTable[passed] => current

    for (iIndex = 0; iIndex < DateConstants.DATE_ROW_COUNT; iIndex += 1) {

    // 当前行的日期，一行7个，每次循环清空当前行
    const dateCells = [];

    for (jIndex = 0; jIndex < DateConstants.DATE_COL_COUNT; jIndex += 1) {
      current = dateTable[passed];

      // 样式拼接
      let cls = cellClass;

      // 当前日期进行判断
      const isBeforeCurrentMonthYear = beforeCurrentMonthYear(current, value);
      const isAfterCurrentMonthYear = afterCurrentMonthYear(current, value);
      // 上个月 - 样式置灰
      if (isBeforeCurrentMonthYear) {
        cls += ` ${lastMonthDayClass}`;
      }
      // 下个月 - 样式置灰
      if (isAfterCurrentMonthYear) {
        cls += ` ${nextMonthDayClass}`;
      }
      /*
        源码此处还有很多其他样式的判断与添加...
        就不一一进行列举了。
      */
      let dateHtml;
      // 自定义日期单元渲染接口
      if (dateRender) {
        dateHtml = dateRender(current, value);
      } else {
        const content = contentRender ? contentRender(current, value) : current.date();
        dateHtml = (
          <div
            key={getIdFromDate(current)}
            className={dateClass}
          >
            {content}
          </div>
        );
      }
      // 内循环，依次循环组成一行，每行进行7次遍历
      dateCells.push(
        <td
          key={passed}
          onClick={props.onSelect.bind(null, current)}
          onMouseEnter={(props.onDayHover && props.onDayHover.bind(null, current)) || undefined
          }
          role="gridcell"
          title={getTitleString(current)}
          className={cls}
        >
          {dateHtml}
        </td>,
      );
      // 递增+1，方便下次取值
      passed += 1;
    }
    // 外循环，进行一整行的添加，一共进行6次遍历
    tableHtml.push(
      <tr
        key={iIndex}
        role="row"
        className={cx({
          [`${prefixCls}-current-week`]: isCurrentWeek,
          [`${prefixCls}-active-week`]: isActiveWeek,
        })}
      >
        {dateCells}
      </tr>,
    );
  }
```