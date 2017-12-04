angular.module("todo",[])
 //编辑状态自动获取焦点
    .directive("autoFocus",["$timeout",function($timeout){
        return {
            restrict:"A",
            link:function(scope,element,attributes){
                scope.$watch("item.isEditing",function(newValue){
                    if(newValue){
                        $timeout(function(){
                        element[0].focus()
                    },0)
                    }
                })
            }
        }
    }])
    .controller("myCtrl",["$scope",function($scope){
        //创建任务列表
        $scope.taskList = []

        //本地储存读取数据
        getData()
        function getData(){
            if(localStorage.getItem("taskList")){
                $scope.taskList = angular.fromJson(localStorage.getItem("taskList"))
            }
        }
        //console.log("文件关联成功")
        //添加任务
        $scope.addTask = function(e){
            if(e.keyCode == 13 && $scope.task.length){
                $scope.taskList.push(
                        {
                            name:$scope.task,
                            isCompleted:false,
                            isEditing:false
                        }
                    )
                $scope.task=""
            }
        }

        //删除任务
        $scope.deletTask = function(task){
            $scope.taskList.splice($scope.taskList.indexOf(task),1)
        }

        //未完成任务的数量
        $scope.unfinished = function(){
            var mount = 0
            $scope.taskList.forEach(function(item,i){
                if(!item.isCompleted){
                    mount++
                }
            })
            return mount
        }

        //任务完成状态过滤
        $scope.condition = ""
        $scope.isSelected = "All"
        $scope.taskStatus = function(status){
            switch(status){
                case "All":
                $scope.condition=""
                $scope.isSelected = "All"
                break;
                case "Active":
                $scope.condition = false
                $scope.isSelected = "Active"
                break;
                case "Completed":
                $scope.condition = true
                $scope.isSelected = "Completed"
                break;
            }
        }

        //清除完成的显示与隐藏
        $scope.haveCompleted = function(){
            for(let i = 0 ; i < $scope.taskList.length;i++){
                if($scope.taskList[i].isCompleted){
                    return true
                }
            }
            return false
        }

        //清除已完成的任务
        $scope.deletCompletedTask = function(){
            $scope.taskList=$scope.taskList.filter(function(item){
                return item.isCompleted==false
            })
        }

        //双击编辑
        $scope.editing = function(task){
            $scope.taskList.forEach(function(item,i){
                item.isEditing = false
            })
            task.isEditing = true
        }

        //编辑状态失去焦点
        $scope.cancel = function(task){
            task.isEditing = false
        }
        //深度监听 localstorage 的 taskList
        $scope.$watch("taskList",function(){
                localStorage.setItem("taskList",angular.toJson($scope.taskList))
            },true)
    }])

