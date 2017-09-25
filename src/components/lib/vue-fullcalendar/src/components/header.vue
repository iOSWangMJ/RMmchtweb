<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <slot name="header-left">
      </slot>
    </div>
    <div class="header-center">
    </div>
    <div class="header-right">
        <div class="month-select">
            <span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span>
            <span class="title">{{title}}</span>
            <span class="next-month" @click.stop="goNext">{{rightArrow}}</span>
        </div>
      <slot name="header-right">
      </slot>

    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './dateFunc'

  export default {
    created () {
      this.dispatchEvent()
    },
    props : {
      currentDate : {},
      titleFormat : {},
      firstDay    : {},
      monthNames  : {}
    },
    data () {
      return {
        title      : '',
        leftArrow  : '<',
        rightArrow : '>',
        headDate : new Date()
      }
    },
    watch : {
      currentDate (val) {
        if (!val) return
        this.headDate = val
        // console.log('currentDate', val)
        // this.headDate = JSON.parse(JSON.stringify(val))
      }
    },
    methods : {
      goPrev () {
        this.headDate = this.changeMonth(this.headDate, -1)
        this.dispatchEvent()
      },
      goNext () {
        this.headDate = this.changeMonth(this.headDate, 1)
        this.dispatchEvent()
      },
      changeMonth (date, num) {
        let dt = new Date(date)
        return new Date(dt.setMonth(dt.getMonth() + num))
      },
      dispatchEvent() {
        this.title = dateFunc.format(this.headDate, this.titleFormat, this.monthNames)

        let startDate = dateFunc.getStartDate(this.headDate)
        let curWeekDay = startDate.getDay()


        // begin date of this table may be some day of last month
        let diff = parseInt(this.firstDay) - curWeekDay
        diff = diff > 0 ? (diff - 7) : diff
        startDate.setDate(startDate.getDate() + diff)

        // the month view is 6*7
        let endDate = dateFunc.changeDay(startDate, 41)
        if (endDate.getDate() >= 7) {
            let date = endDate.getDate()
            endDate = endDate.setDate(date-7)
        }

        // 1st day of current month
        let currentDate = dateFunc.getStartDate(this.headDate)

        this.$emit('change',
          dateFunc.format(startDate, 'yyyy-MM-dd'),
          dateFunc.format(endDate, 'yyyy-MM-dd'),
          dateFunc.format(currentDate,'yyyy-MM-dd'),
          this.headDate
        )
      }
    }
  }
</script>
<style lang="scss">
.full-calendar-header{
    font-size: 16px;
  display: flex;
  align-items: center;
  .header-left,.header-right{
    flex:4;
  }
  .header-right{
      display: flex;
      flex-direction: row-reverse;
      .month-select{
          display: inline-block;
          padding: 5px 0;
          width: 120px;
          border-radius: 25px;
          // background: #dbe1e8;
          .title{
            padding: 0;
          }
          .prev-month,.next-month{
            cursor: pointer;
          }
      }
  }
  // .header-center{
  //   flex:3;
  //   text-align:center;
  //   div{
  //       display: inline-block;
  //       padding: 5px 0;
  //       width: 150px;
  //       border-radius: 25px;
  //       // background: #dbe1e8;
  //       .title{
  //         padding: 0 10px;
  //       }
  //       .prev-month,.next-month{
  //         cursor: pointer;
  //       }
  //   }



    // .prev-month{
    //     border-top-left-radius: 10px;
    //     border-bottom-left-radius: 10px;
    // }
    // .next-month{
    //     border-top-right-radius: 10px;
    //     border-bottom-right-radius: 10px;
    // }
  // }
}
</style>
