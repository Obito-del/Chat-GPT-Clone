

const conversation1 = 
    {
    "title": "Casual Greeting",
    "create_time": 1786807965.826628,
    "update_time": 1786807968.17821,
    "moderation_results": [],
    "plugin_ids": null,
    "conversation_id": "6a80869c-fccc-83ea-b8ca-6bc7426e243e",
    "conversation_template_id": null,
    "gizmo_id": null,
    "gizmo_type": null,
    "is_archived": false,
    "is_starred": null,
    "safe_urls": [
        "https://www.progressive.com",
        "https://github.com/openclaw/openclaw",
        "https://www.statefarm.com",
        "https://www.openai.com",
        "https://docs.google.com/document/d/",
        "https://www.apple.com/"
    ],
    "blocked_urls": [],
    "default_model_slug": "auto",
    "atlas_mode_enabled": null,
    "conversation_origin": null,
    "is_read_only": null,
    "voice": null,
    "async_status": null,
    "disabled_tool_ids": [],
    "is_temporary_chat": false,
    "is_do_not_remember": false,
    "memory_scope": "global_enabled",
    "context_scopes": null,
    "sugar_item_id": null,
    "sugar_item_visible": false,
    "pinned_time": null,
    "is_study_mode": false,
    "owner": null,
    "mapping": {
        "client-created-root": {
            "id": "client-created-root",
            "message": null,
            "parent": null,
            "children": [
                "4309d0b8-78e7-4d40-bbab-25574086a1a5"
            ]
        },
        "4309d0b8-78e7-4d40-bbab-25574086a1a5": {
            "id": "4309d0b8-78e7-4d40-bbab-25574086a1a5",
            "message": {
                "id": "4309d0b8-78e7-4d40-bbab-25574086a1a5",
                "author": {
                    "role": "user",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1786808529.504,
                "update_time": 1786807968.500687,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Hey man how are you"
                    ]
                },
                "status": "finished_successfully",
                "end_turn": null,
                "weight": 1.0,
                "metadata": {
                    "serialization_metadata": {
                        "custom_symbol_offsets": []
                    },
                    "request_id": "c9e4c5ce-74e6-4fc1-b4f3-cbaf0babd9cd",
                    "message_source": null,
                    "turn_exchange_id": "c47c9fc9-487c-4f4f-9662-299b506462ee",
                    "working_turn_id": "c47c9fc9-487c-4f4f-9662-299b506462ee",
                    "resolved_model_slug": "gpt-5-6",
                    "can_save": false
                },
                "recipient": "all",
                "channel": null
            },
            "parent": "client-created-root",
            "children": [
                "c15138a4-d885-46e0-be43-5bf044ffadb3"
            ]
        },
        "c15138a4-d885-46e0-be43-5bf044ffadb3": {
            "id": "c15138a4-d885-46e0-be43-5bf044ffadb3",
            "message": {
                "id": "c15138a4-d885-46e0-be43-5bf044ffadb3",
                "author": {
                    "role": "assistant",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1786807965.721623,
                "update_time": 1786807968.501364,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Hey man! I’m good 😄 How are **you** doing today? What’s up?"
                    ]
                },
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 1.0,
                "metadata": {
                    "finish_details": {
                        "type": "stop",
                        "stop_tokens": [
                            200002
                        ]
                    },
                    "is_complete": true,
                    "citations": [],
                    "content_references": [],
                    "resolved_model_slug": "gpt-5-6",
                    "search_result_groups": [],
                    "cot_version": "v5",
                    "request_id": "c9e4c5ce-74e6-4fc1-b4f3-cbaf0babd9cd",
                    "message_type": "next",
                    "turn_exchange_id": "c47c9fc9-487c-4f4f-9662-299b506462ee",
                    "working_turn_id": "c47c9fc9-487c-4f4f-9662-299b506462ee",
                    "model_slug": "gpt-5-6",
                    "default_model_slug": "auto",
                    "can_save": true,
                    "parent_id": "e69fb5d0-a448-4edf-81d8-4f5dd42dc2f3",
                    "model_switcher_deny": []
                },
                "recipient": "all",
                "channel": "final"
            },
            "parent": "4309d0b8-78e7-4d40-bbab-25574086a1a5",
            "children": []
        }
    },
    "current_node": "c15138a4-d885-46e0-be43-5bf044ffadb3",
    "context_truncation_continuation": null
}



// const myArray = [];

// conversation1.forEach(item => {
//   myArray.push({
//     title: item.title,
//     id: item.conversation_id
//   });
// });
// // return myArray;

// console.log(conversation1);


const chat = Object?.values(conversation1.mapping);

const myArray = chat.map((item) => {
    if(item?.message?.author?.role) {
        return {
             id: item.id,
                role: item.message?.author?.role,
                text: item.message?.content?.parts?.[0] 
        }
    
}});
console.log(myArray);