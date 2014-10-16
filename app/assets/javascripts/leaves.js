$(function() {

 	 $(".leave_kind").click(function(){   
   	    data_id=$(this).attr("data-id");
        if($(this).prop("checked")){
          $("li.kind_"+data_id).show();
        }else{
        	 $("li.kind_"+data_id).hide();
        }        
        
   });
//计算请假当天的日期处理是半天还是一天
  function cal_today_work_time(date_at){
  	
  	 date = date_at
  	 rest_day=cal_rest_on_work_day(date,1)
  	 if(rest_day==1){
  	 	return 0
  	 }
  	 real_hour = date.getHours();
     if(real_hour<8 || real_hour >19){
         return 0
     }    
  	  hour = Math.abs(18-date.getHours()); 	
  	  if(hour<1){
  	  	return 0
  	  }else if(hour<7){
  	  	return 0.5
  	  }else{
  	  	return 1
  	  }
  }
//计算公休假和请假的时间
   function cal_rest_on_work_day(start_at,diff_day){
   	  var i;
   	  var rest=0;
   	  var work=0;
   	  var weekends = 0;
     for(i=0;i<diff_day;i++){
       //  var day = new Date(start_at.getFullYear()+"/"+(start_at.getMonth()+1)+"/"+(start_at.getDate()+i)+" 00:00:00");     
       var day = start_at.getFullYear()+"/"+(start_at.getMonth()+1)+"/"+(start_at.getDate()+i);  
       
       if(jQuery.inArray(day, rest_days)>=0){
         	rest=rest+1;
         }
        if(jQuery.inArray(day,work_days)>=0){
         	work +=1;
         }
         if(new Date(day).getDay()==0 || new Date(day).getDay()==6){
         	weekends+=1
         }
      }
      return rest+weekends-work
   }
 //计算请假的日期
   function cal_diff_time(start_at,end_at){
        var start_at = new Date(start_at);
        var end_at = new Date(end_at);
        var s_hour = cal_today_work_time(start_at);
        var e_hour = Math.abs(cal_today_work_time(end_at)-1);
     
        //console.log("call_diff_time:"+start_at)
        var n_s_day = new Date(start_at.getFullYear()+"/"+(start_at.getMonth()+1)+"/"+(start_at.getDate()+1)+" 00:00");
        var p_e_day = new Date(end_at.getFullYear()+"/"+(end_at.getMonth()+1)+"/"+end_at.getDate()+" 00:00");
       
        var	diff = p_e_day - n_s_day
        var vdaysdiff = Math.floor(diff/1000/60/60/24);  // in days
        
        //console.log(n_s_day)
        rest_work_day = cal_rest_on_work_day(n_s_day,vdaysdiff);
        return vdaysdiff+s_hour+e_hour-rest_work_day       

   }
//设置请假的起始和结束最大最小日期
   function changeMaxMinDay(ct,$input){
   	 var data_id=$input.attr("data-id");
   	 var data_value=$($input).attr("data-value");
   	 var checked_max_date = max_date(data_id)
   	 //console.log(checked_max_date)
   	 if("start_at_"+data_id==data_value){
   	 	this.setOptions({
			allowTimes:['09:00','12:00','13:00'],
			defaultTime: "09:00",
			minDate: new Date(checked_max_date),
			maxDate:$('.end_at_'+data_id).val()? new Date($('.end_at_'+data_id).val()):false
		});

   	 }
   	  if("end_at_"+data_id==data_value){
   	 	this.setOptions({
			allowTimes:['12:00','13:00','18:00'],
			defaultTime: "18:00",
			minDate:$('.start_at_'+data_id).val()? new Date($('.start_at_'+data_id).val()): new Date(checked_max_date)
		});

   	 }


   }

  function test_for_minDate(input){
  	var data_id=$(input).attr("data-id");
  	var checked_max_date = find_max_date(input)
  	date = new Date(checked_max_date);
   	return [date.format("yyyy/mm/dd")];
   }

   function test_for_start_date(input){
   	  var data_id=$(input).attr("data-id");
     // if("start_at_"+data_id==data_value){
   	  return '2014/10/17 09:00:00'
   }
//显示时间的函数

   $('.datetimepicker1').click(function(){
   //	var data = 
   	
   	WdatePicker({
       //$preLoad: true,
       firstDayOfWeek: 0,
       minDate: test_for_minDate(this),
       isShowClear: false,
       readOnly: true,
       autoPickDate: true,
       startDate: '%y/%M/%d 00:00:00',
       dateFmt:'yyyy/MM/dd HH:mm:ss',
       alwaysUseStartDate:true,

       //disabledDays:[0,6],

       
       //disabledDates: ["2014-11-17","2014-10-17"],
      // onpicking: can_choose_date,
      // specialDays: [6],
       onpicked: cal_days_for_chose

      


   	});

   })
/*
    $('.datetimepicker1').datetimepicker({
	        format: "Y/m/d  H:i",	        
	        firstDay: 0,   
	        lang: "ch", 
	        showAnim: '' ,  
	        duration: '' ,  
            closeOnDateSelect: true,  
            defaultTime: "09:00",    
            onShow: changeMaxMinDay,
            beforeShowDay: noWeekendsOrHolidays,
            onClose: function(dp,$input){
            	data_id = $input.attr("data-id");
            	start_at = $(".start_at_"+data_id).val()
            	end_at = $(".end_at_"+data_id).val()
            	if(start_at!="" && end_at!=""){
            		 days = cal_diff_time(start_at,end_at)
            		 if(data_id=="0" && parseFloat(days)>parseFloat(total_nj_day)){
            		 	//alert("您一共有"+total_nj_day+"天年假，请重新选择");

            		 }
            		$("#select_days_"+data_id).val(days)
            	}
            }
            
	});
 */

function cal_days_for_chose(){
   
	data_id = $(this).attr("data-id");
    start_at = $(".start_at_"+data_id).val();
    end_at = $(".end_at_"+data_id).val();
 
     if(start_at!="" && end_at!=""){

         var days = cal_diff_time(start_at,end_at);
        
         if(data_id=="0" && parseFloat(days)>parseFloat(total_nj_day)){
            alert("您一共有"+total_nj_day+"天年假，请重新选择");
           }
         $("#select_days_"+data_id).val(days)
     }

}

function can_choose_date(){
    date = $dp.cal.getDateStr();
    a=["2014/10/12","2014/10/13","2014/10/14"]
    
   

}

//计算选择的时候大小值
var find_max_date=function find_checked_max_date(input){
    var array=[];
    var re = []
    value=$(input).attr("data-value");
    $('.leave_kind:checkbox:checked').each(function () {
    	var d_value=$(this).attr("data-value");
    	var d_id=$(this).attr("data-id");
    	
    	if(d_value!=value && $("#start_at_"+d_id).val()!=""){array.push($("#start_at_"+d_id).val());}
     	if(d_value!=value && $(".end_at_"+d_id).val()!=""){array.push($(".end_at_"+d_id).val())} 
     	 
     })

    if(array.length==0){
    	return new Date() 
    }
    console.log(array.sort())
    return new Date(array.sort()[array.length-1])
    
}


//计算选择的时候大小值
var max_date=function choosed_checked_max_date(ci){
    var array=[];
    var re = []
    console.log(ci)
    $('.leave_kind:checkbox:checked').each(function () {
    	var d_id=$(this).attr("data-id");
    	console.log($("#start_at_"+d_id).val()) 
    	if(d_id!=ci && $("#start_at_"+d_id).val()!=""){array.push($("#start_at_"+d_id).val());}
     	if(d_id!=ci && $(".end_at_"+d_id).val()!=""){array.push($(".end_at_"+d_id).val())} 
     	//   
     })
   
    //array = array.join(",").split(",")
    if(array.length==0){
    	return new Date() 
    }
    console.log(array.sort())
    return new Date(array.sort()[array.length-1])
    
}
//计算设置的公休假和周末上班的方法
function noWeekendsOrHolidays(date) {
        var noWeekend = $.datepicker.noWeekends(date);
        if (noWeekend[0]) {
            return nationalDays(date);
        } else {
            flag =  nationalDays(date)[0];
        	for (i = 0; i < work_days.length; i++) {
        	  month= parseInt(work_days[i].split("/")[1])
    	      day = parseInt(work_days[i].split("/")[2])
              if (date.getMonth() == month - 1
                  && date.getDate() == day && flag) {
                 return [true, ''];
                }
             }
            return [false,''];
        }
    }

//周末上班和休息的设置
function nationalDays(date) {
    //rest_days=natDays.concat(cal_chosed_days())
    for (i = 0; i < rest_days.length; i++) {
    	month= parseInt(rest_days[i].split("/")[1])
    	day = parseInt(rest_days[i].split("/")[2])
      if (date.getMonth() == month - 1
          && date.getDate() == day) {
        return [false, ''];
      }
    }
  return [true, ''];
}

jQuery.validator.addMethod("cal_nj_days", function(value,element) {   
      console.log("value:"+value)
      console.log(this.optional(element) || parseFloat(value)<=parseFloat(total_nj_day))
       return this.optional(element) || parseFloat(value)<=parseFloat(total_nj_day);   
   
 }, "您的年假一共"+total_nj_day+"天,请重新选择");   
      



$('.new_leave').on('submit', function(e) {
 $('.leave_kind:checkbox:checked').each(function () {
 	       var d_id=$(this).attr("data-id");
 	       if(d_id=="0"){
 	       $("#select_days_0").rules("add", {
                required: true,
                cal_nj_days: true,
                 messages: {
                  required: "一共可以请"+total_nj_day
				 }
            });
 	       }
            $("#start_at_"+d_id).rules("add", {
                required: true,
                 messages: {
                  required: "请填写请假起始日期"
				 }
            });
            $("#end_at_"+d_id).rules("add", {
                required: true,
                 messages: {
                  required: "请填写请假结束日期"
				 }
            });
  })
});

  $(".new_leave").validate({ 
	  errorElement: "b",
  	  rules:{
  	  	"leave[title]": "required",
  	  	"leave[leave_details_attributes][kind][]": "required"
  	  },
  	  messages: {
  	  	"leave[title]": "不能为空",
  	  	"leave[leave_details_attributes][kind][]": "选择请假类型"
  	  	
  	  }
  });


})
