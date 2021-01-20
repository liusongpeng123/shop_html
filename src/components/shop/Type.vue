<template>
  <div>
  <el-tree
    :data="dat"
    :props="defaultProps"
    node-key="id">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
            <el-button type="text" icon="el-icon-circle-plus" circle  @click= "() => append(data)" >新增</el-button>
            <el-button type="text" icon="el-icon-edit" circle  @click= "() => toUpdate(data)" >修改</el-button>
            <el-button type="text" icon="el-icon-remove" circle  @click= "() => del(node,data)" >删除</el-button>

        </span>
      </span>


  </el-tree>
  <el-dialog title="新增节点" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="名称" >
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </div>
  </el-dialog>

    <!--  弹框  -->
    <el-dialog
      title="修改信息"
      :visible.sync="updateFromShowFlag"
    >

      <el-form ref="form"  style="width: 60%"label-width="80px" align="center">
        <el-form-item label="修改名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateForm">确定修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>



  </div>
</template>

<script>

    export default {
        name: "Type",
        data(){
          return{
            dialogFormVisible: false,
            updateFromShowFlag:false,
            typeTree:[],// 远程请求的数据
            dat:[],//tree 的数据
            jsonStr:"",//递归拼接处理
            defaultProps: {
             children: 'children',
              label: 'name'
            },
            form:{
              id:"",
              name:"",
              pid:""
            }

          }
      },
      methods:{
        chandleData(){
          for (let i = 0; i <this.typeTree.length ; i++) {
              if(this.typeTree[i].pid==0){
                this.digui(this.typeTree[i]);
                break;
              }
          }
         /* console.log(this.jsonStr);*/
          this.dat.push(JSON.parse(this.jsonStr))
        },
        digui(node){
          var no=this.isParent(node);
          if (no==true){
            this.jsonStr+='{"id":'+node.id+',"name":"'+node.name+'","children":[';
            let  count=0;
            for (let i = 0; i <this.typeTree.length ; i++) {
              if(node.id==this.typeTree[i].pid){
                count++;
                this.digui(this.typeTree[i]);
                this.jsonStr+=",";
              }
            }
            if (count!=0){
              this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
            }
            this.jsonStr+=']}';
          } else{
              this.jsonStr+='{"id":'+node.id+',"name":"'+node.name+'"}';
          }
        },
        isParent(node){// 判断是否为父节点  pid 有没有指向当前id

          for (let i = 0; i <this.typeTree.length ; i++) {
            if (node.id==this.typeTree[i].pid){
              return true;
            }
          }
          return false;
        },
        append(dat) {
          /*console.log(dat);*/
          this.form=[];
          this.dialogFormVisible=true;
          this.form.pid=dat.id;
         /* console.log(JSON.stringify(this.form))*/
        },
        add(){
          debugger;
          var tthis=this;
            this.$axios.post("http://localhost:8080/api/type/add",this.$qs.stringify(this.form)).then(function (rs) {
              tthis.dialogFormVisible=false;
              tthis.getData();
            }).catch(function () {
                    console.log("新增失败");
                })
        },
        getData(){
        var tthis=this;
    this.$axios.get("http://localhost:8080/api/type/getData").then(function (rs) {
      /*     console.log(rs.data.data);*/
      tthis.typeTree=rs.data.data ;
      tthis.chandleData();
    }).catch(function () {
      console.log("查询失败");
    })

        },
        toUpdate(data){
          this.updateFromShowFlag=true;
          this.form=data;
        },
        updateForm(){
              this.$axios.post("http://localhost:8080/api/type/update",this.$qs.stringify(this.form)).then(rs=> {
                this.updateFromShowFlag=false;
             /*   console.log(rs.data);*/
                this.getData();
              }).catch(function () {
                console.log("修改失败");
              })
        },
        del(node,dat){
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === dat.id);
          children.splice(index, 1);
        }
      },

      created() {
        this.getData();


      }
    }
</script>

<style scoped>

</style>
